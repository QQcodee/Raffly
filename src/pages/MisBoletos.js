import HeaderSocios from "../components/HeaderSocios";
import { useUser } from "../UserContext";
import supabase from "../config/supabaseClient";
import BoletosList from "../components/BoletosList";
import BoletoNuevo from "./BoletoNuevo";

const { useState, useEffect } = require("react");

const MisBoletos = () => {
  const { user } = useUser();
  const [boletos, setBoletos] = useState([]);

  useEffect(() => {
    const fetchBoletos = async () => {
      const { data, error } = await supabase
        .from("boletos")
        .select()
        .eq("user_id", user.id);

      if (data) {
        setBoletos(data);
      }
    };
    fetchBoletos();
  }, [user]);

  return (
    <>
      <HeaderSocios />
      <h1>Mis Boletos</h1>
      {boletos && (
        <div className="rifas-grid-archive">
          {boletos.map((boleto) => (
            <BoletosList key={boleto.id} boleto={boleto} />
          ))}
        </div>
      )}
    </>
  );
};

export default MisBoletos;
