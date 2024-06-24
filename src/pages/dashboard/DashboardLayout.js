import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useUser } from "../../UserContext";
import { Auth } from "@supabase/auth-ui-react";
import supabase from "../../config/supabaseClient";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const { user, userRole } = useUser();
  const { user_id } = useParams();

  const navigate = useNavigate();

  return (
    <>
      {user && userRole ? (
        user.id === user_id ? (
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
          <>
            <h1>No estas autorizado en este panel</h1>
            <button onClick={() => navigate("/dashboard/" + user?.id)}>
              Ir a tu panel{" "}
            </button>
          </>
        )
      ) : (
        <h1>Cargando...</h1>
      )}
    </>
  );
};

export default DashboardLayout;
