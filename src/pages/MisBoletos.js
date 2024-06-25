import HeaderSocios from "../components/HeaderSocios";
import supabase from "../config/supabaseClient";
import BoletosList from "../components/BoletosList";

import { useState, useEffect } from "react";
import { useUser } from "../UserContext";

const MisBoletos = () => {
  const { user } = useUser();
  const [boletos, setBoletos] = useState([]);

  useEffect(() => {
    const fetchBoletos = async () => {
      const { data, error } = await supabase
        .from("boletos")
        .select()
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setBoletos(data);
      }
    };
    fetchBoletos();
  }, [user]);

  return (
    <>
      <HeaderSocios />
      <h1 style={{ textAlign: "left", marginLeft: "40px", marginTop: "60px" }}>
        Mis Boletos
      </h1>
      {boletos && (
        <div className="boletos-grid-archive">
          {boletos.map((boleto) => (
            <BoletosList key={boleto.id} boleto={boleto} />
          ))}
        </div>
      )}
    </>
  );
};

export default MisBoletos;
