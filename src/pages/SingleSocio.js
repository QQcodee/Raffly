import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";

import { useState, useEffect } from "react";

import RifaList from "../components/RifaList";
import { useNavigate } from "react-router-dom";

import HeaderSocios from "../components/HeaderSocios";

//import SingleSocio.css
import "../css/Single-Socios/SingleSocios.css";

const SingleSocio = () => {
  const { user_id } = useParams();

  const [fetchError, setFetchError] = useState(null);
  const [rifas, setRifas] = useState(null);

  const [socioMetaData, setSocioMetaData] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRifas = async () => {
      const { data, error } = await supabase
        .from("rifas")
        .select()
        .eq("user_id", user_id);

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

  useEffect(
    () => async () => {
      const fetchSocioMetaData = async () => {
        const { data, error } = await supabase
          .from("user_metadata")
          .select()
          .eq("user_id", user_id);

        if (error) {
          console.log(error);
        }
        if (data) {
          setSocioMetaData(data);
        }
      };

      fetchSocioMetaData();
    },
    [user_id, rifas]
  );

  return (
    <>
      <HeaderSocios />

      <div className="div-grid-archive">
        {fetchError && <p>{fetchError}</p>}
        <div className="rifas-title">
          <h2>Rifas Activas </h2>
          <hr className="divider-title-rifas-activas" />
        </div>

        {rifas && (
          <div className="rifas-grid-archive">
            {rifas.map((rifa) => (
              <RifaList key={rifa.id} rifa={rifa} />
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: "50px",

          maxWidth: "100vw",

          textAlign: "center  ",
        }}
        className="home-socios"
      >
        <div
          style={{
            width: "100%",
            padding: "20px",
            backgroundColor: socioMetaData[0]
              ? socioMetaData[0].color
              : "black",
            marginBottom: "80px",
          }}
          className="FAQ-Header"
          id="FAQ"
        >
          <h2
            style={{
              textAlign: "center",
              color: "white",
            }}
          >
            Preguntas frecuentes
          </h2>
        </div>

        <div className="body-socios">
          <p className="tittle-faq">¿CÓMO SE ELIGE A LOS GANADORES?</p>

          {socioMetaData[0] ? (
            <p className="p-faq">
              Todos nuestros sorteos se realizan en base a la Lotería Nacional
              para la Asistencia Pública mexicana. <br /> <br />
              El ganador de {socioMetaData[0].nombre_negocio} será el
              participante cuyo número de boleto coincida con las últimas cifras
              del primer premio ganador de la Lotería Nacional (las fechas serán
              publicadas en nuestra página oficial).
            </p>
          ) : null}

          <p className="tittle-faq">
            ¿QUÉ SUCEDE CUANDO EL NÚMERO GANADOR ES UN BOLETO NO VENDIDO?
          </p>

          <p className="p-faq">
            Se elige un nuevo ganador realizando la misma dinámica en otra fecha
            cercana (se anunciará la nueva fecha). <br /> <br />
            Esto significa que, ¡Tendrías el doble de oportunidades de ganar con
            tu mismo boleto!
          </p>

          <p className="tittle-faq">¿DÓNDE SE PUBLICA A LOS GANADORES?</p>

          {socioMetaData[0] ? (
            <>
              <p className="p-faq">
                En nuestra página oficial de Facebook{" "}
                {socioMetaData[0].nombre_negocio} puedes encontrar todos y cada
                uno de nuestros sorteos anteriores, así como las transmisiones
                en vivo con Lotería Nacional y las entregas de premios a los
                ganadores! <br /> <br />
                Encuentra transmisión en vivo de los sorteos en nuestra página
                de Facebook en las fechas indicadas a las 20:00 hrs CDMX. ¡No te
                lo pierdas!
              </p>

              <p
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "23px",

                  fontWeight: "800",
                  maxWidthwidth: "600px",
                  margin: "auto",
                  marginTop: "50px",
                }}
              >
                Envianos tus preguntas a
              </p>

              <div
                style={{ display: "flex", justifyContent: "center" }}
                id="Contacto"
              >
                {socioMetaData[0].phone && (
                  <a
                    onClick={() =>
                      window.open(
                        "https://api.whatsapp.com/send/?phone=" +
                          socioMetaData[0].phone +
                          "&text=Hola tengo una duda"
                      )
                    }
                  >
                    <img
                      src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/whatsapp.png"
                      alt="logo"
                      style={{
                        width: "80px",
                        margin: "auto",
                        marginTop: "20px",
                        padding: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </a>
                )}

                {socioMetaData[0].facebook_url && (
                  <a onClick={() => window.open(socioMetaData[0].facebook_url)}>
                    <img
                      src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/facebook.png"
                      alt="logo"
                      style={{
                        width: "80px",
                        margin: "auto",
                        marginTop: "20px",
                        padding: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </a>
                )}
                {socioMetaData[0].instagram_url && (
                  <a
                    onClick={() => window.open(socioMetaData[0].instagram_url)}
                  >
                    <img
                      src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/instagram.png"
                      alt="logo"
                      style={{
                        width: "80px",
                        margin: "auto",
                        marginTop: "20px",
                        padding: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </a>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div className="whatsapp-sticky">
        <a
          onClick={() =>
            window.open(
              "https://api.whatsapp.com/send/?phone=" +
                socioMetaData[0].phone +
                "&text=Hola tengo una duda"
            )
          }
        >
          <img
            src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/whatsapp.png"
            alt="logo"
            style={{
              width: "80px",
              marginTop: "20px",
              padding: "10px",
              cursor: "pointer",
            }}
          />
        </a>
      </div>
    </>
  );
};

export default SingleSocio;
