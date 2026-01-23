import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";


import Card from "../components/ui/Card.jsx";
import Checkbox from "../components/ui/Checkbox.jsx";
import IconButton from "../components/ui/IconButton.jsx";
import { getPlan, updateTask } from "../services/plans.js";

export default function PlanDetails() {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDays, setOpenDays] = useState([]);
  const currentDayRef = useRef(null);
  const hasScrolledRef = useRef(false);

  const days = useMemo(() => plan?.content?.days ?? [], [plan?.content?.days]);
  const currentDayIndex = useMemo(() => {
    if (!days.length) {
      return -1;
    }

    const firstIncompleteIndex = days.findIndex((day) =>
      day.tasks?.some((task) => !task.completed)
    );

    return firstIncompleteIndex === -1 ? days.length - 1 : firstIncompleteIndex;
  }, [days]);

  const currentDay = currentDayIndex >= 0 ? days[currentDayIndex] : null;

  useEffect(() => {
    let isMounted = true;

    async function loadPlan() {
      try {
        const data = await getPlan(id);
        if (isMounted) {
          setPlan(data);
        }
      } catch (err) {
        const message = err.response?.data?.message || "Falha ao carregar plano";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPlan();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    setOpenDays([]);
    hasScrolledRef.current = false;
  }, [id]);

  useEffect(() => {
    if (!currentDay) {
      return;
    }

    setOpenDays((prev) => (prev.length ? prev : [currentDay.day]));
  }, [currentDay]);

  useEffect(() => {
    if (!currentDay || hasScrolledRef.current || !currentDayRef.current) {
      return;
    }

    currentDayRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    hasScrolledRef.current = true;
  }, [currentDay]);

  async function handleToggle(taskId, completed) {
    try {
      const updated = await updateTask(id, taskId, completed);
      setPlan(updated);
    } catch (err) {
      const message = err.response?.data?.message || "Falha ao atualizar task";
      setError(message);
    }
  }

  if (loading) {
    return <p className="text-sm text-text-body">Carregando...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-400" role="alert">
        {error}
      </p>
    );
  }

  if (!plan) {
    return <p className="text-sm text-text-body">Plano nao encontrado.</p>;
  }

  return (
    <section className="space-y-8">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-semibold text-text-titles font-display">{plan.title || plan.goal}</h1>
            </div>
            <div className="space-y-1 text-sm text-text-body">
              <p>{plan.goal}</p>
              <p className="capitalize">Nível: {plan.level}</p>
              <p>Tempo: {plan.hoursDay}h/dia</p>
              <p>Prazo: {plan.deadline} dias</p>
            </div>
          </div>
          <div className="text-right self-end">
            <p className="text-sm text-text-body">Progresso</p>
            <p className="text-2xl font-semibold text-primary">{plan.progress}%</p>
          </div>
        </div>
        <div>
          <div className="h-2 w-full rounded-full bg-primary/15">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${plan.progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {days.map((day) => {
          const isOpen = openDays.includes(day.day);
          const panelId = `day-panel-${day.day}`;
          const headerId = `day-header-${day.day}`;
          const isCurrentDay = currentDay?.day === day.day;

          return (
            <div key={day.day} ref={isCurrentDay ? currentDayRef : null} className="scroll-mt-24">
              <Card className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/30 text-primary h-8 w-8 text-sm text-center rounded-full flex items-center justify-center mt-1">
                    {day.day}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-text-titles">
                          <span>Dia {day.day}: </span>
                          {day.topic}
                        </h2>
                        <p className="text-sm text-text-body">{day.goal}</p>
                      </div>
                      <IconButton
                        type="button"
                        id={headerId}
                        size="sm"
                        className="border-transparent cursor-pointer text-text-body hover:border-surface"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        aria-label={isOpen ? `Recolher tarefas do dia ${day.day}` : `Expandir tarefas do dia ${day.day}`}
                        onClick={() =>
                          setOpenDays((prev) =>
                            prev.includes(day.day)
                              ? prev.filter((item) => item !== day.day)
                              : [...prev, day.day]
                          )
                        }
                      >
                        {isOpen ? (
                          <X className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="h-4 w-4" aria-hidden="true" />
                        )}
                      </IconButton>

                    </div>
                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={headerId}
                      >
                        {day.tasks.map((task) => (
                          <Checkbox
                            key={task.id}
                            id={`task-${task.id}`}
                            checked={task.completed}
                            onChange={(event) => handleToggle(task.id, event.target.checked)}
                          >
                            <span
                              className={
                                task.completed
                                  ? "text-text-body line-through"
                                  : "text-text-titles"
                              }
                            >
                              {task.description}
                            </span>
                          </Checkbox>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}
