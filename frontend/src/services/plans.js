import api from "./api.js";

export async function createPlan(payload) {
  const response = await api.post("/plans", payload);
  return response.data;
}

export async function listPlans() {
  const response = await api.get("/plans");
  return response.data;
}

export async function getPlan(id) {
  const response = await api.get(`/plans/${id}`);
  return response.data;
}

export async function updateTask(planId, taskId, completed) {
  const response = await api.patch(`/plans/${planId}/task`, {
    taskId,
    completed,
  });
  return response.data;
}
