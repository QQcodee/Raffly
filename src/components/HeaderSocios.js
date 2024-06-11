import "../css/HeaderSocios.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../UserContext";

const HeaderSocios = () => {
  const { user_id } = useParams();
  const [socioMetaData, setSocioMetaData] = useState([]);

  const { user, userRole } = useUser();

  const navigate = useNavigate();

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
      {socioMetaData[0] ? (
        <>
          <header
            className="header-socio"
            style={{ backgroundColor: socioMetaData[0].color }}
          >
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
                      "/mis-boletos"
                    }
                  >
                    Mis Boletos
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
                {user || userRole === "Socio" ? (
                  <li>
                    <a href={"/dashboard/" + user?.id}>Dashboard</a>
                  </li>
                ) : null}
              </ul>
            </nav>
          </header>
        </>
      ) : null}
    </>
  );
};

export default HeaderSocios;
