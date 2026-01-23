import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Badge from "./ui/Badge.jsx";
import Card from "./ui/Card.jsx";

export default function PlanCard({ plan }) {
  return (
    <Card as="article" className="flex h-full min-h-50 flex-col justify-between gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 capitalize">
        <div className="flex flex-col w-full">
          <Badge className="self-end">{plan.status}</Badge>
          <h3 className="text-lg font-display font-semibold text-text-titles mt-2">{plan.title || plan.goal}</h3>
          <p className="text-sm text-text-body">{plan.deadline} dias</p>
        </div>

      </div>
      <div>
        <div className="text-xs flex justify-between text-text-body">
          <p>Progresso</p>
          <p className="text-primary font-semibold">{plan.progress}%</p>
        </div>
        <div className="w-full h-2 bg-primary/20 rounded-full mt-2">
          <div className="bg-primary rounded-full h-full"
            style={{ width: `${plan.progress}%` }}></div>
        </div>
      </div>

      <hr className="border-t border-text-body/30 bg-transparent" />

      <div className="flex justify-end">
        <Link
          to={`/plans/${plan.id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-body transition-all duration-300 ease-out hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
        >
          Ver detalhes
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
