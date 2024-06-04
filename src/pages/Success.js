import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import { ThemeSupa, Auth } from "@supabase/auth-ui-shared";
import { useUser } from "../UserContext";

export default function Success() {
  const { user } = useUser();
  //const { logout } = useUser();
  const navigate = useNavigate();

  async function logout() {
    const { error } = await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <div>
      <header>
        {user ? (
          <>
            <h1>Success</h1>
            <h1>{user.email}</h1>
            <button onClick={logout}>Logout</button>
            <button onClick={() => navigate("/")}>Home</button>
          </>
        ) : (
          <>
            <h1>Volver al inicio</h1>
            <button onClick={() => navigate("/")}>Home</button>
          </>
        )}
      </header>
    </div>
  );
}
