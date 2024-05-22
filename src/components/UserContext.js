import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";

const UserContext = () => {
  const [user, setUser] = useState({});
  const [userRole, setUserRole] = useState(null);
  const user_id = user.id;

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

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data, error } = await supabase
        .from("user_roles_view")
        //.from("user_roles")
        .select()
        .eq("user_id", user_id);
      if (error) {
        console.log(error);
      }
      if (data) {
        //console.log(data);
        //setUserRole(data[0].role_id);
        setUserRole(data[0].roles[0]);
        console.log(userRole);
      }
    };
    fetchUserRole();
  }, [user_id]);
};

export default UserContext;
