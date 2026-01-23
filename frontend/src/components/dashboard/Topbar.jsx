import { Menu, X } from "lucide-react";

import IconButton from "../ui/IconButton.jsx";

export default function Topbar({ isSidebarOpen, onMenuToggle }) {
  return (
    <header className="sticky top-0 z-30 border-b border-surface/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <IconButton
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden"
            aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isSidebarOpen}
            aria-controls="dashboard-sidebar"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </IconButton>
          <div>

            <h2 className="text-lg font-semibold text-text-titles">Dashboard</h2>
            
            {/* <h2 className="text-lg font-semibold text-text-titles">
              {current?.title || "Painel"}
            </h2>
            <p className="text-sm text-text-body">
              {current?.subtitle || "Gerencie seus estudos."}
            </p> */}
          </div>
        </div>
      </div>
    </header>
  );
}
