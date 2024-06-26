import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { useNavigate } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";
import "../css/index.css"; // Ensure this is correctly linked
import "../css/NavHome.css";
import HeaderHome from "../components/HeaderHome";
import HeaderGlobal from "../components/HeaderGlobal";

//import HeaderLogin from "./HeaderLogin";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/success");
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  return (
    <div>
      <div>
        <HeaderGlobal />
      </div>
      <div className="login-container">
        <div className="auth-component">
          <h1>Iniciar Sesion</h1>
          <Auth
            supabaseClient={supabase}
            providers={["google"]}
            magicLink={true}
            redirectTo="https://www.raffly.com.mx/"
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
        </div>
      </div>
    </div>
  );
}

export default Login;
