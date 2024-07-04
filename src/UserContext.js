import React, { createContext, useState, useEffect, useContext } from "react";
import supabase from "./config/supabaseClient";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userMetaData, setUserMetaData] = useState([]);
  const [authListener, setAuthListener] = useState(null); // State to hold the auth listener

  useEffect(() => {
    // Fetch initial user data
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

    // Listen for auth state changes (login/logout)
    const listener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null); // Clear user state on logout
        setUserRole(null); // Clear userRole state on logout
        setUserMetaData([]); // Clear userMetaData state on logout
      }
    });

    // Save the listener in state
    setAuthListener(listener);

    // Cleanup listener on component unmount
    return () => {
      if (authListener) {
        authListener.unsubscribe(); // Unsubscribe from auth changes
      }
    };
  }, []);

  useEffect(() => {
    // Fetch user metadata when user changes
    async function fetchUserMetaData() {
      if (!user) return;

      const { data, error } = await supabase
        .from("user_metadata")
        .select()
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user metadata:", error.message);
        return;
      }

      if (data) {
        setUserMetaData(data);
      }
    }

    fetchUserMetaData();
  }, [user]);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) return;

      const { data, error } = await supabase
        .from("user_roles")
        .select(
          `
          *,
          role_id (
            role_name
          )
        `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user role:", error.message);
        return;
      }

      if (
        data &&
        data.length > 0 &&
        data[0].role_id &&
        data[0].role_id.role_name
      ) {
        //console.log(data[0].role_id.role_name);
        setUserRole(data[0].role_id.role_name);
      }
    }

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    //console.log(userRole);
  }, [userRole]);
  return (
    <UserContext.Provider value={{ user, userRole, userMetaData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
