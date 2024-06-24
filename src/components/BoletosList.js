import React from "react";
//import "./BoletosList.css"; // Import CSS file
import "../css//Single-Socios/BoletosList.css";
import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BoletosList = ({ boleto }) => {
  // Joining num_boletos array elements with commas
  const numBoletosString = boleto.num_boletos.join(", ");
  const [socioMetaData, setSocioMetaData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserMetaData = async () => {
      const { data, error } = await supabase
        .from("user_metadata")
        .select()
        .eq("user_id", boleto.socio_user_id);

      if (error) {
        console.log(error);
      }
      if (data) {
        setSocioMetaData(data);

        //console.log(data);
      }
    };
    fetchUserMetaData();
  }, [boleto.socio_user_id]);

  const handleRedirect = () => {
    window.open(boleto.oxxo_url);
  };

  const ticketNumbersWhatsapp = boleto.num_boletos.join("%0A");
  const count = boleto.num_boletos.length;

  const totalAmount = count * boleto.precio;

  const handlePagarTransferencia = () => {
    window.open(
      "https://api.whatsapp.com/send/?phone=" +
        socioMetaData[0].phone +
        "&text=Porfavor envia una foto del comprobante de pago para asegurar tus " +
        count +
        " boletos para el combo millonario: %0A ———————————— %0A Nombre: " +
        boleto.nombre +
        "%0A Telefono: " +
        boleto.telefono +
        "%0A%0A Boletos($" +
        boleto.precio +
        "c/u):%0A" +
        ticketNumbersWhatsapp +
        "%0A%0ATOTAL: $" +
        totalAmount +
        " %0A%0A Una vez enviado el comprobante de pago activaremos tu boleto en un periodo de 24hrs."
    );
  };
  return (
    <>
      {socioMetaData[0] ? (
        <div
          className="ticket"
          style={{ backgroundColor: socioMetaData[0].color }}
        >
          {boleto.comprado === true ? (
            <aside style={{ color: "#6FCF85" }}>{boleto.nombre_rifa}</aside>
          ) : (
            <aside style={{ color: "black" }}>Falta Pagar</aside>
          )}

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
                    ? "Apartado pago pendiente"
                    : boleto.oxxo === true
                    ? "Pago con oxxo pendiente"
                    : "Falta Pagar"}
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
            {boleto.comprado === true ? (
              <h4>¡MUCHA SUERTE!</h4>
            ) : boleto.oxxo ? (
              <button onClick={handleRedirect}>Voucher oxxo</button>
            ) : boleto.apartado ? (
              <button onClick={handlePagarTransferencia}>Pagar boleto</button>
            ) : null}
          </section>
          {boleto.comprado === true ? (
            <aside style={{ color: "#6FCF85" }}>{boleto.nombre_rifa}</aside>
          ) : (
            <aside style={{ color: "red" }}>Falta Pagar</aside>
          )}
        </div>
      ) : null}
    </>
  );
};

export default BoletosList;
