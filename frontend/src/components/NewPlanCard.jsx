import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import Card from "./ui/Card.jsx";

export default function NewPlanCard() {
  return (
    <Card
      as={Link}
      to="/plans/new"
      className="flex min-h-50 h-full flex-col items-center justify-center gap-3 border-dashed border-text-body text-text-titles transition-all ease-out duration-300 hover:border-primary/70 hover:bg-surface/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
      aria-label="Criar novo plano"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full text-background bg-text-body/85">
        <Plus className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-sm font-semibold">Novo plano</span>
    </Card>
  );
}
