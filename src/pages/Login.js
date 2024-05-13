import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { useNavigate } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../config/supabaseClient";
import "../css/index.css";


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
    <div>
      
         <div>
          <h1 align="center"> Iniciar Sesion</h1>
          </div>   
          <div align="center">
          <Auth
          supabaseClient={supabase}
          providers={["google"]}
          magicLink={true}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          
          
        />
        </div>
        

    </div>
  );
}

export default Login;
