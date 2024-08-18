import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useUser } from "../../UserContext";
import { Auth } from "@supabase/auth-ui-react";
import supabase from "../../config/supabaseClient";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from "../Login";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const { user, userRole } = useUser();
  const { user_id } = useParams();

  const [cuentasAdicionales, setCuentasAdicionales] = useState([
    "nimadresputito",
  ]);

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchUserMetaData = async () => {
      const { data, error } = await supabase
        .from("user_metadata")
        .select("sub_cuentas")
        .eq("user_id", user_id)
        .single();
      if (error) {
        console.error("Error fetching user metadata:", error.message);
        return;
      }

      if (data.sub_cuentas.length === 0) {
        return;
      }

      setCuentasAdicionales(data.sub_cuentas);
    };
    fetchUserMetaData();
  }, [user]);

  const navigate = useNavigate();

  return (
    <>
      {user && userRole ? (
        user.id === user_id || cuentasAdicionales.includes(user.id) ? (
          userRole === "Admin" ||
          userRole === "Socio" ||
          userRole === "Equipo" ? (
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
            <>No eres socio raffly, Que haces aqui?</>
          )
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <h1>No estas autorizado en este panel</h1>
              <p>Si esto es un error contacta a soporte</p>

              <button onClick={() => navigate("/")}>Volver al inicio </button>
            </div>
          </>
        )
      ) : user && !userRole ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <p
              style={{
                textAlign: "center",
                fontWeight: "400",
                fontSize: "24px",
              }}
            >
              Panel de administracion
            </p>
            <p>
              Para poder acceder a este panel debes iniciar sesion en una cuenta
              con acceso
            </p>
            <button onClick={() => navigate("/")}>Volver al inicio</button>
          </div>
        </>
      ) : !user && !userRole ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontWeight: "400",
              fontSize: "24px",
            }}
          >
            Panel de administracion
          </p>
          <p>
            Para poder acceder a este panel debes iniciar sesion en una cuenta
            con acceso
          </p>
          <button onClick={() => navigate("/")}>Volver al inicio</button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "400",
              fontFamily: "Poppins",
            }}
          >
            Cargando...
          </p>
        </div>
      )}
    </>
  );
};

export default DashboardLayout;
