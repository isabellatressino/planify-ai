import { NavLink } from "react-router-dom";

export default function SidebarItem({ to, label }) {
  const base =
    "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer";

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${base} ${
          isActive
            ? "bg-surface text-text-titles shadow-inner shadow-black/30"
            : "text-text-body hover:bg-surface/70 hover:text-text-titles"
        }`
      }
    >
      <span className="h-2 w-2 rounded-full bg-primary/70" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}
