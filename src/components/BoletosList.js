import React from "react";
import CountdownTimer from "./CountdownTimer";
//import "./BoletosList.css"; // Import CSS file
import "../css//Single-Socios/BoletosList.css";
import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";

const BoletosList = ({ boleto }) => {
  // Joining num_boletos array elements with commas
  const numBoletosString = boleto.num_boletos.join(", ");
  const [socioMetaData, setSocioMetaData] = useState([]);

  useEffect(() => {
    const fetchUserMetaData = async () => {
      const { data, error } = await supabase
        .from("user_metadata")
        .select()
        .eq("nombre_negocio", boleto.socio);

      if (error) {
        console.log(error);
      }
      if (data) {
        setSocioMetaData(data);

        //console.log(data);
      }
    };
    fetchUserMetaData();
  }, [boleto.socio]);

  return (
    <>
      {socioMetaData[0] ? (
        <div
          className="ticket"
          style={{ backgroundColor: socioMetaData[0].color }}
        >
          <aside>{boleto.nombre_rifa}</aside>
          <section className="ticket__first-section">
            <section>
              <img src={socioMetaData[0].image_url} alt="logo" />
              <h4>{boleto.socio}</h4>
            </section>

            <section>
              <strong style={{ fontSize: "16px" }}>
                Numeros:{" "}
                <span style={{ fontSize: "11px" }}> {numBoletosString}</span>
              </strong>
              <div>
                <span></span>
                <ul></ul>
              </div>
            </section>
            <ul>
              <li>
                <p>
                  <strong>SORTEO:</strong>
                </p>
                <p>{boleto.nombre_rifa}</p>
              </li>
              <li>
                <p>
                  <strong>NOMBRE:</strong>
                </p>
                <p>{boleto.nombre}</p>
              </li>

              <li>
                <p>
                  <strong>ESTADO:</strong>
                </p>
                <p>CHIHUAHUA</p>
              </li>
              <li>
                <p>
                  <strong>ESTADO:</strong>
                </p>
                <p>
                  {boleto.comprado === true
                    ? "Pagado"
                    : boleto.apartado === true
                    ? "Apartado"
                    : "No Pagado"}
                </p>
              </li>
              <li>
                <p>
                  <strong>FECHA:</strong>
                </p>
                <p>{boleto.fecharifa}</p>
              </li>
            </ul>
          </section>
          <section
            className="ticket__second-section"
            style={{
              backgroundImage: `url(${boleto.img_rifa})`,
            }}
          ></section>
          <section className="ticket__third-section">
            <h4>¡MUCHA SUERTE!</h4>
          </section>
          <aside>{boleto.nombre_rifa}</aside>
        </div>
      ) : null}
    </>
  );
};

export default BoletosList;
