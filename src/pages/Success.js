import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import { ThemeSupa, Auth } from "@supabase/auth-ui-shared";

export default function Success() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          console.log(value.data.user);
          setUser(value.data.user);
        }
      });
    }
    getUserData();
  }, []);

  async function logout() {
    const { error } = await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <div>
      <header>
        {Object.keys(user).length > 0 ? (
          <>
            <h1>Success</h1>
            <h1>{user.email}</h1>
            <button onClick={() => logout()}>Logout</button>
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
