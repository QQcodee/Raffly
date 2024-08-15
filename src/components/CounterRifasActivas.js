import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

const CounterRifasActivas = ({ idSocio }) => {
  const [rifas, setRifas] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchRifas = async () => {
      const { data, error } = await supabase
        .from("rifas")
        .select()
        .eq("status", "True")
        .eq("user_id", idSocio);

      if (error) {
        setFetchError("Could not fetch rifas");
        setRifas(null);
        console.log(error);
      }
      if (data) {
        setRifas(data);
        setFetchError(null);
      }
    };

    fetchRifas();
  }, []);

  return (
    <div>
      <h1>{rifas.length} Rifas Activas</h1>
    </div>
  );
};

export default CounterRifasActivas;
