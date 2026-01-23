import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../../assets/icons/i-logo.svg?react";
import useAuth from "../../hooks/useAuth.js";
import { getProfile } from "../../services/auth.js";
import Button from "../ui/Button.jsx";
import IconButton from "../ui/IconButton.jsx";
import SidebarItem from "../ui/SidebarItem.jsx";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const displayName = (profile?.name || "").trim() || profile?.email || "Usuario";

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const data = await getProfile();
        if (isMounted) {
          setProfile(data);
        }
      } catch {
        if (isMounted) {
          setProfile(null);
        }
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden cursor-pointer ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-surface bg-background/95 px-5 py-6 backdrop-blur-xl transition-transform lg:fixed lg:w-64 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-3 text-text-titles">
            <span className="flex h-5 w-5 items-center justify-center rounded-full">
              <Logo className="h-full w-full text-primary" aria-hidden="true" focusable="false" />
            </span>
            <span className="font-semibold font-display text-primary">PlanifyAI</span>
          </div>
          <IconButton
            type="button"
            onClick={onClose}
            className="lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </IconButton>
        </div>
        <nav className="mt-10 flex-1 space-y-2">
          <SidebarItem to="/dashboard" label="Dashboard" />
          <SidebarItem to="/plans/new" label="Novo plano" />
          <SidebarItem to="/profile" label="Perfil" />
        </nav>
        <div className="border-t border-surface/80 pt-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-text-titles">
              {displayName}
            </span>
            <span className="text-xs text-text-body">
              {profile?.email || "Conta ativa"}
            </span>
          </div>
          <Button
            type="button"
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="mt-4 w-full"
          >
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
}
