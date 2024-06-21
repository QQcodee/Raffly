// UserContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../src/config/supabaseClient";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function getUserData() {
      const { data: authData, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user data:", error.message);
        return;
      }
      if (authData?.user) {
        setUser(authData.user);
      }
    }
    getUserData();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchUserRole = async () => {
      const { data, error } = await supabase
        .from("user_roles_view")
        .select()
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user role:", error.message);
        return;
      }

      if (data) {
        setUserRole(data[0]?.roles[0]);
      }
    };

    fetchUserRole();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, userRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
