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
      {user === null ? (
        <Auth
          supabaseClient={supabase}
          providers={["google"]}
          magicLink={true}
          appearance={{ theme: ThemeSupa }}
          theme="minimal"
          localization={{
            variables: {
              sign_in: {
                email_label: "Correo electronico",
                password_label: "Contraseña",
                email_input_placeholder: "Tu correo electronico",
                password_input_placeholder: "Tu contraseña",
                button_label: "Iniciar Sesion",
                loading_button_label: "Iniciando Sesion...",
                social_provider_text: "Inicia Sesion con {{provider}}",
                link_text: "Ya tienes una cuenta? Iniciar Sesion",
                confirmation_text: "Checa tu email para confirmar tu cuenta",
              },
              sign_up: {
                email_label: "Correo electronico",
                password_label: "Contraseña",
                email_input_placeholder: "Tu correo electronico",
                password_input_placeholder: "Crear Contraseña",
                link_text: "No tienes una cuenta? Crear una",
                button_label: "Crear Cuenta",
              },
              forgotten_password: {
                link_text: "Olvidas tu contraseña?",
                email_label: "Correo electronico",
                email_input_placeholder: "Tu correo electronico",
                button_label:
                  "Enviar instrucciones para recuperar tu contraseña",
              },
              magic_link: {
                link_text: "Enviar link magico",
              },
              update_password: {
                password_label: "Contraseña",
                password_input_placeholder: "Tu nueva contraseña",
                button_label: "Cambiar Contraseña",
                loading_button_label: "Cambiando Contraseña...",
                confirmation_text: "Tu contraseña ha sido cambiada",
              },
            },
          }}
        />
      ) : userRole === "Admin" || userRole === "Socio" ? (
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
        <div>
          <h1>No tiene permisos para ver esta pagina</h1>
        </div>
      )}
    </>
  );
};

export default DashboardLayout;
