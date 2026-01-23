export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-text-body/20 mt-12">
      <div className="px-6 py-4 max-w-7xl mx-auto flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-text-titles">PlanifyAI</span>
          <span>
            Roteiros de estudo inteligentes com IA para você aprender com foco e consistência.
          </span>
        </div>

        <span className="text-xs sm:text-sm">
          © {year} PlanifyAI. Todos os direitos reservados.
        </span>
      </div>
    </footer>
  );
}
