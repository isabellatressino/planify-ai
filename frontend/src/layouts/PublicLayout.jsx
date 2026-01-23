import { Outlet } from "react-router-dom";

import PublicNavbar from "../components/public/PublicNavbar.jsx";

export default function PublicLayout() {
  return (
    <div className="relative">
      <PublicNavbar />
      <Outlet />
    </div>
  );
}
