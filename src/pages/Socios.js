import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

//import components
import SociosList from "../components/SociosList";
import HeaderHome from "../components/HeaderHome";

//import css

const Socios = () => {
  const [socios, setSocios] = useState([]);

  useEffect(() => {
    const fetchSocios = async () => {
      const { data, error } = await supabase.from("user_metadata").select();

      if (error) {
        setSocios(null);
        console.log(error);
      } else {
        setSocios(data);
      }
    };

    fetchSocios();
  }, []);

  return (
    <div>
      <HeaderHome />
      <div>
        <h1>Socios </h1>
      </div>

      {socios && (
        <div className="rifas-grid">
          {socios.map((socio) => (
            <SociosList key={socio.id} socio={socio} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Socios;
