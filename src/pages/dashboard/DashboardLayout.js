import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useUser } from "../../UserContext";
import { Auth } from "@supabase/auth-ui-react";
import supabase from "../../config/supabaseClient";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const DashboardLayout = () => {
  const { user, userRole } = useUser();

  return (
    <>
      {user && userRole ? (
        userRole === "Admin" || userRole === "Socio" ? (
          <div className="dashboard-layout">
            <Topbar />
            <div className="dashboard-content">
              <Sidebar />
              <main className="main-content">
                <Outlet />
              </main>
            </div>
          </div>
        ) : (
          <>No tienes acceso</>
        )
      ) : (
        <h1>Cargando...</h1>
      )}
    </>
  );
};

export default DashboardLayout;
