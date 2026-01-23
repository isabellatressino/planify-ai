import crypto from "crypto";

import * as planService from "../services/plan.service.js";
import { generateStudyPlan } from "../services/openai.service.js";
import prisma from "../prisma/client.js";
import { hashEmail } from "../utils/emailHash.js";

const LEVELS = new Set(["iniciante", "intermediario", "avancado"]);
const LIMITS = {
  deadlineMin: 1,
  deadlineMax: 30,
  hoursDayMin: 1,
  hoursDayMax: 6,
  goalMin: 3,
  goalMax: 80,
};

export async function createPlan(req, res) {
  try {
    const { goal, level, hoursDay, deadline } = req.body;
    const hoursDayValue = Number(hoursDay);
    const deadlineValue = Number(deadline);

    const validationError = validateCreateInput({
      goal,
      level,
      hoursDay: hoursDayValue,
      deadline: deadlineValue,
    });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const user = await planService.getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    let emailHash = user.emailHash;
    if (!emailHash && user.email) {
      const computedHash = hashEmail(user.email);
      await prisma.user.update({
        where: { id: user.id },
        data: { emailHash: computedHash },
      });
      emailHash = computedHash;
    }
    if (!emailHash) {
      return res.status(500).json({ message: "missing email to hash" });
    }

    let creditsRemaining;
    try {
      const creditResult = await planService.consumeFreeCredit(emailHash);
      creditsRemaining = creditResult.creditsRemaining;
    } catch (err) {
      if (err.code === "NO_CREDITS") {
        return res.status(403).json({ message: "Cr\u00e9ditos gr\u00e1tis esgotados" });
      }
      if (err.code === "LEDGER_NOT_FOUND") {
        return res.status(500).json({ message: "ledger not found" });
      }
      throw err;
    }

    let aiContent;
    try {
      aiContent = await generateStudyPlan({
        goal,
        level,
        hoursDay: hoursDayValue,
        deadline: deadlineValue,
      });
    } catch (err) {
      console.error(err);
      return res.status(502).json({ message: "Falha ao gerar plano com IA" });
    }

    const content = normalizeContent(aiContent, {
      goal,
      level,
      hoursDay: hoursDayValue,
      deadline: deadlineValue,
    });
    const title = getPlanTitle(aiContent, goal);
    // Persist progress/status so GETs are fast and reflect product state without recomputing.
    const { progress, status } = computeProgressStatus(content);
    const created = await planService.createPlanWithCredit({
      goal,
      title,
      level,
      hoursDay: hoursDayValue,
      deadline: deadlineValue,
      content,
      progress,
      status,
      userId: req.userId,
    });

    return res.status(201).json({ ...created, creditsRemaining });
  } catch (err) {
    if (err.code === "OPENAI_TIMEOUT") {
      console.error(err);
      return res.status(504).json({ message: "OpenAI timeout" });
    }
    if (err.code === "OPENAI_FAILED") {
      console.error(err);
      return res.status(502).json({ message: "Falha ao gerar plano com IA" });
    }
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function listPlans(req, res) {
  try {
    const plans = await planService.listPlans(req.userId);
    const response = plans.map((plan) => attachProgressStatus(plan));
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function getPlanById(req, res) {
  try {
    const plan = await planService.getPlanById(req.userId, req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "plan not found" });
    }

    return res.status(200).json(attachProgressStatus(plan));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function deletePlan(req, res) {
  try {
    const plan = await planService.getPlanById(req.userId, req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "plan not found" });
    }

    await planService.deletePlanById(plan.id);
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function updateTask(req, res) {
  try {
    const { taskId, completed } = req.body;

    if (!taskId || typeof taskId !== "string") {
      return res.status(400).json({ message: "taskId is required" });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "completed must be boolean" });
    }

    const plan = await planService.getPlanById(req.userId, req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "plan not found" });
    }

    const { content, updated } = updateTaskCompletion(plan.content, taskId, completed);
    if (!updated) {
      return res.status(404).json({ message: "task not found" });
    }

    const { progress, status } = computeProgressStatus(content);
    const updatedPlan = await planService.updatePlanContentWithProgress(
      plan.id,
      content,
      progress,
      status
    );
    return res.status(200).json(updatedPlan);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
}

function validateCreateInput({ goal, level, hoursDay, deadline }) {
  if (!goal || typeof goal !== "string") {
    return "goal is required";
  }
  if (goal.length < LIMITS.goalMin || goal.length > LIMITS.goalMax) {
    return `goal must be between ${LIMITS.goalMin} and ${LIMITS.goalMax} characters`;
  }
  if (!LEVELS.has(level)) {
    return "level must be one of: iniciante, intermediario, avancado";
  }
  if (
    !Number.isFinite(hoursDay) ||
    hoursDay < LIMITS.hoursDayMin ||
    hoursDay > LIMITS.hoursDayMax
  ) {
    return `hoursDay must be between ${LIMITS.hoursDayMin} and ${LIMITS.hoursDayMax}`;
  }
  if (
    !Number.isInteger(deadline) ||
    deadline < LIMITS.deadlineMin ||
    deadline > LIMITS.deadlineMax
  ) {
    return `deadline must be between ${LIMITS.deadlineMin} and ${LIMITS.deadlineMax}`;
  }

  return null;
}

function normalizeContent(aiContent, fallback) {
  if (!aiContent || !Array.isArray(aiContent.days)) {
    const error = new Error("Invalid AI content");
    error.code = "OPENAI_FAILED";
    throw error;
  }

  const days = aiContent.days.map((day, index) => {
    if (!day || !Array.isArray(day.tasks)) {
      const error = new Error("Invalid AI tasks");
      error.code = "OPENAI_FAILED";
      throw error;
    }

    const tasks = day.tasks.map((task) => {
      if (!task || typeof task.description !== "string") {
        const error = new Error("Invalid AI task description");
        error.code = "OPENAI_FAILED";
        throw error;
      }
      return {
        id: generateTaskId(),
        description: task.description,
        completed: false,
      };
    });

    return {
      day: Number.isInteger(day.day) ? day.day : index + 1,
      topic: typeof day.topic === "string" ? day.topic : `Day ${index + 1} focus`,
      goal: typeof day.goal === "string" ? day.goal : `Study ${fallback.goal}`,
      tasks,
    };
  });

  return { days };
}

function getPlanTitle(aiContent, fallbackGoal) {
  if (typeof aiContent?.title !== "string") {
    return fallbackGoal;
  }
  const title = aiContent.title.trim();
  return title ? title : fallbackGoal;
}

function generateTaskId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function updateTaskCompletion(content, taskId, completed) {
  let updated = false;
  const days = Array.isArray(content?.days) ? content.days : [];

  const newDays = days.map((day) => {
    const tasks = Array.isArray(day?.tasks) ? day.tasks : [];
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        updated = true;
        return { ...task, completed };
      }
      return task;
    });
    return { ...day, tasks: newTasks };
  });

  return { content: { ...content, days: newDays }, updated };
}

function computeProgressStatus(content) {
  const days = Array.isArray(content?.days) ? content.days : [];
  const tasks = days.flatMap((day) => (Array.isArray(day?.tasks) ? day.tasks : []));
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed === true).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  const status = progress === 100 ? "COMPLETED" : "ACTIVE";
  return { progress, status };
}

function attachProgressStatus(plan) {
  if (typeof plan.progress === "number" && typeof plan.status === "string") {
    return withTitleFallback(plan);
  }
  const { progress, status } = computeProgressStatus(plan.content);
  return withTitleFallback({ ...plan, progress, status });
}

function withTitleFallback(plan) {
  if (typeof plan.title === "string" && plan.title.trim()) {
    return plan;
  }
  return { ...plan, title: plan.goal };
}
