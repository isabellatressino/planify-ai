import { useEffect, useState } from "react";
import PlanCard from "../components/PlanCard.jsx";
import NewPlanCard from "../components/NewPlanCard.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { listPlans } from "../services/plans.js";
import { LayoutGrid } from "lucide-react";

export default function Dashboard() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPlans() {
      try {
        const data = await listPlans();
        if (isMounted) {
          setPlans(data);
        }
      } catch (err) {
        const message = err.response?.data?.message || "Falha ao carregar planos";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPlans();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      <PageHeader
        title="Seus planos"
        subtitle="Acompanhe seu progresso diario."
        icon={LayoutGrid}
      />

      {loading ? <p className="text-sm text-text-body">Carregando...</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {!loading && !plans.length ? (
        <p className="text-sm text-text-body">Nenhum plano criado ainda.</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
        <NewPlanCard />
      </div>

    </section>
  );
}
