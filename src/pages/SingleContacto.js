import HeaderSocios from "../components/HeaderSocios";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";

import { useState, useEffect } from "react";

const SingleContacto = () => {
  const { user_id } = useParams();
  const [socioMetaData, setSocioMetaData] = useState([]);

  useEffect(() => {
    const fetchUserMetaData = async () => {
      const { data, error } = await supabase
        .from("user_metadata")
        .select()
        .eq("user_id", user_id);

      if (error) {
        console.log(error);
      }
      if (data) {
        setSocioMetaData(data);

        //console.log(data);
      }
    };
    fetchUserMetaData();
  }, []);

  return (
    <>
      <div>
        <HeaderSocios socioMetaData={socioMetaData} />
        <h1>SingleContacto</h1>
      </div>
    </>
  );
};

export default SingleContacto;
