import { Link, Outlet } from "react-router-dom";
import Logo from "../assets/icons/i-logo.svg?react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background text-text-titles">
      <header className="fixed z-50 w-full border-b border-surface bg-background/75 px-6 py-3 backdrop-blur-md">
        <Link to="/" className=" inline-flex items-center gap-2 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer">
          <span className="h-4 w-4">
            <Logo className="h-full w-full" aria-hidden="true" focusable="false" />
          </span>
          <span className="text-md">PlanifyAI</span>
        </Link>
      </header>
      <Outlet />
    </div>
  );
}
