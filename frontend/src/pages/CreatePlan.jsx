import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { createPlan } from "../services/plans.js";

export default function CreatePlan() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("iniciante");
  const [hoursDay, setHoursDay] = useState(2);
  const [deadline, setDeadline] = useState(7);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createPlan({
        goal,
        level,
        hoursDay: Number(hoursDay),
        deadline: Number(deadline),
      });
      setCreditsRemaining(result.creditsRemaining);
      navigate(`/plans/${result.plan.id}`);
    } catch (err) {
      const message = err.response?.data?.message || "Falha ao criar plano";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Criar plano"
        subtitle="Defina objetivo, nivel, horas por dia e prazo."
        icon={Sparkles}
      />
      <div>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <label>
            <div className="flex gap-3 items-center">
              <span className="rounded-full bg-primary h-6 w-6 text-sm flex text-background font-bold font-display justify-center items-center">1</span>
              <p className="text-text-titles font-display text-lg">Qual seu principal objetivo?</p>
            </div>
            <Input
              type="text"
              required
              value={goal}
              placeholder="Ex.: Aprender Python para ciência de dados começando do zero..."
              onChange={(event) => setGoal(event.target.value)}
              className="mt-2"
            />
          </label>
          <label>
            <div className="flex gap-3 items-center">
              <span className="rounded-full bg-primary h-6 w-6 text-sm flex text-background font-bold font-display justify-center items-center">2</span>
              <p className="text-text-titles font-display text-lg">Nível de conhecimento atual</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { value: "iniciante", label: "Iniciante" },
                { value: "intermediario", label: "Intermediário" },
                { value: "avancado", label: "Avançado" },
              ].map((opt) => {
                const active = level === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLevel(opt.value)}
                    className={`rounded-xl cursor-pointer border px-4 py-4 text-center text-sm font-semibold transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active
                      ? "border-primary/70 bg-primary/10 text-primary"
                      : "border-text-body/30 bg-surface text-text-titles hover:border-primary/40"
                      }`}
                    aria-pressed={active}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </label>

          <label>
            <div className="flex gap-3 items-center">
              <span className="rounded-full bg-primary h-6 w-6 text-sm flex text-background font-bold font-display justify-center items-center">
                3
              </span>
              <p className="text-text-titles font-display text-lg">Tempo disponível por dia</p>
            </div>

            <div className="mt-4 rounded-md border border-text-body/30 bg-surface p-4">
              <div className="flex items-center justify-between text-sm text-text-body">
                <span>Horas por dia</span>
                <span className="font-semibold text-primary">{hoursDay}h/dia</span>
              </div>

              <input
                type="range"
                min={1}
                max={6}
                step={.5}
                value={hoursDay}
                onChange={(event) => setHoursDay(Number(event.target.value))}
                className="mt-4 w-full cursor-pointer rounded-full bg-background accent-primary appearance-none"
                aria-label="Horas disponíveis por dia"
              />

              <div className="mt-2 flex justify-between text-xs text-text-body/70">
                <span>1h</span>
                <span>2h</span>
                <span>3h</span>
                <span>4h</span>
                <span>5h</span>
                <span>6h</span>
              </div>
            </div>
          </label>


          <label>
            <div className="flex gap-3 items-center">
              <span className="rounded-full bg-primary h-6 w-6 text-sm flex text-background font-bold font-display justify-center items-center">
                4
              </span>
              <p className="text-text-titles font-display text-lg">Prazo em dias</p>
            </div>

            <div>

              <Input
                type="number"
                min="1"
                max="30"
                value={deadline}
                onChange={(event) => setDeadline(Number(event.target.value))}
                className="mt-2"
                aria-label="Prazo em dias"
              />

              <p className="mt-2 text-xs text-text-body/70">
                Dica: um prazo entre 7 e 30 dias costuma funcionar bem.
              </p>
            </div>
          </label>


          {error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          {creditsRemaining !== null ? (
            <p className="text-sm text-text-body">
              Creditos restantes: {creditsRemaining}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full cursor-pointer mt-5"
          >
            {loading ? "Gerando..." : "Gerar plano"}
          </Button>
        </form>
      </div>
    </section>
  );
}
