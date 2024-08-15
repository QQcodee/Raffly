import HeaderGlobal from "../components/HeaderGlobal";
import FooterGlobal from "../components/FooterGlobal";
import supabase from "../config/supabaseClient";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import InfoBancos from "../components/InfoBancos";

const MetodosPago = () => {
  const [userMetaData, setUserMetaData] = useState([]);
  const { nombre_negocio, user_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchsocioMetadata = async () => {
      const { data, error } = await supabase
        .from("user_metadata")
        .select("phone, color, image_url, bancos")
        .eq("user_id", user_id);

      if (error) {
        console.log(error);
      }

      if (data) {
        console.log(data);
        setUserMetaData(data);
      }
    };
    fetchsocioMetadata();
  }, [user_id]);

  return (
    <>
      <HeaderGlobal />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          fontFamily: "Poppins",

          marginBottom: "100px",
        }}
      >
        <h1
          style={{
            marginTop: "100px",
            fontSize: "50px",
            fontWeight: "bold",
            color: "black",
            fontFamily: "Poppins",
          }}
        >
          METODOS DE PAGO
        </h1>

        {userMetaData.length > 0 && (
          <>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "500",
                color: "black",
                fontFamily: "Poppins",
                textAlign: "center",
              }}
            >
              Debes realizar el pago por alguna de éstas opciones y enviar tu
              comprobante de pago al{" "}
            </p>

            <p
              style={{
                fontSize: "27px",
                fontWeight: "500",
                color: "black",
                color: "#007BFF",
                fontFamily: "Poppins",

                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
              onClick={() => {
                window.open(
                  `https://wa.me/${userMetaData[0].phone}?text=Enviar comprobante de pago`
                );
              }}
            >
              <i className="material-icons">open_in_new</i>
              Whatsapp {userMetaData[0].phone}{" "}
            </p>
            <InfoBancos
              info={userMetaData[0].bancos !== null ? userMetaData : undefined}
            />
          </>
        )}
      </div>
      <FooterGlobal />
    </>
  );
};
export default MetodosPago;
