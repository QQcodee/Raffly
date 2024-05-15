import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { useNavigate } from "react-router-dom";
import { ThemeSupa, darkThemes } from "@supabase/auth-ui-shared";
import supabase from "../config/supabaseClient";
import "../css/index.css"; // Ensure this is correctly linked

function Login() {
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthState = async () => {
      const { user } = supabase.auth.session();
      if (user) {
        navigate("/success");
      } else {
        navigate("/login");
      }
    };

    checkAuthState();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/success");
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="auth-component">
        <header className="login-header">
          <h1 >Iniciar Sesión</h1>
        </header> 
        <Auth
          supabaseClient={supabase}
          providers={["google"]}
          magicLink={true}
          appearance={{ theme: ThemeSupa }}
          theme="white"
          localization={{
            variables: {
              sign_in: {
                email_label: 'Correo electronico',
                password_label: 'Contraseña',
                email_input_placeholder	: 'Ingresa tu correo electronico',
                password_input_placeholder : 'Ingresa tu contraseña',
                social_provider_text : 'Iniciar sesion con {{provider}}',
                button_label : 'Iniciar sesion',
                link_text : 'No tienes una cuenta? Crea una.',

              },
            },
          }}
        />
      </div>
    </div>
  );  
}

export default Login;
