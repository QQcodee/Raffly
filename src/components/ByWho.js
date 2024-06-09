import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

const ByWho = ({ user_meta }) => {
  const [socioMetaData, setSocioMetaData] = useState(null);
  useEffect(() => {
    const fetchSocio = async () => {
      const { data, error } = await supabase
        .from("user_metadata_view")
        .select()
        .eq("user_id", user_meta);

      if (error) {
        console.log(error);
      }
      if (data) {
        setSocioMetaData(data[0].nombre_negocio);
      }
    };

    fetchSocio();
  }, []);

  return <p>{socioMetaData}</p>;
};

export default ByWho;
