import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

//import components
import SociosList from "../components/SociosList";
import HeaderHome from "../components/HeaderHome";

//import SociosArchive.css
import "../css//Single-Socios/SocioArchive.css";
import HeaderGlobal from "../components/HeaderGlobal";
import FooterGlobal from "../components/FooterGlobal";

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
    <>
      <HeaderGlobal />

      <div>
        <div className="div-grid-archive-socios">
          <h1 style={{ paddingLeft: "30px" }}>Socios Raffly</h1>

          {socios && (
            <div className="socios-grid">
              {socios.map((socio) => (
                <SociosList key={socio.id} socio={socio} />
              ))}
            </div>
          )}
        </div>
      </div>

      <FooterGlobal />
    </>
  );
};

export default Socios;
