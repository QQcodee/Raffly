import "../css/HeaderSocios.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";

const HeaderSocios = () => {
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
    <header className="header-socio">
      {socioMetaData[0] ? (
        <>
          <div className="logo-title-socio">
            <img
              src={socioMetaData[0].image_url}
              alt="logo"
              className="logo-socio"
            />{" "}
            <h1 className="title-socio">{socioMetaData[0].nombre_negocio}</h1>
          </div>
          <nav className="nav-menu-socio">
            <ul>
              <li>
                <a href="#mis-boletos">Mis Boletos</a>
              </li>
              <li>
                <a
                  href={
                    "/" +
                    encodeURIComponent(
                      socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                    ) +
                    "/" +
                    encodeURIComponent(
                      socioMetaData[0].user_id.replace(/\s+/g, "-")
                    )
                  }
                >
                  Rifas Activas
                </a>
              </li>
              <li>
                <a
                  href={
                    "/" +
                    encodeURIComponent(
                      socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                    ) +
                    "/" +
                    encodeURIComponent(
                      socioMetaData[0].user_id.replace(/\s+/g, "-")
                    ) +
                    "/contacto"
                  }
                >
                  Contacto
                </a>
              </li>

              <li>
                <a href="#metodos-de-pago">Metodos de pago</a>
              </li>

              <li>
                <a href="#metodos-de-pago">Perfil</a>
              </li>
            </ul>
          </nav>
        </>
      ) : null}
    </header>
  );
};

export default HeaderSocios;
