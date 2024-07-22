import React from "react";
//import "./BoletosList.css"; // Import CSS file
import "../css//Single-Socios/BoletosList.css";
import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OxxoPaymentStatus from "./OxxoPaymentStatus";
import CountdownTimer from "./CountdownTimer";

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

  const ticketNumbersWhatsapp = boleto.num_boletos.join("%0A");
  const count = boleto.num_boletos.length;

  const totalAmount = count * boleto.precio;

  const handlePagarTransferencia = () => {
    window.open(
      "https://api.whatsapp.com/send/?phone=" +
        socioMetaData[0].phone +
        "&text=Porfavor envia una foto del comprobante de pago para asegurar tus " +
        count +
        " boletos para el sorteo (" +
        encodeURIComponent(boleto.nombre_rifa) +
        "): %0A ———————————— %0A Nombre: " +
        boleto.nombre +
        "%0A Telefono: " +
        boleto.telefono +
        "%0A%0A Boletos($" +
        boleto.precio +
        "c/u):%0A" +
        ticketNumbersWhatsapp +
        "%0A%0ATOTAL: $" +
        totalAmount +
        " %0A%0A Una vez enviado el comprobante de pago activaremos tu boleto en un periodo de 24hrs. %0A Para ver el estado de tu boleto puedes entrar al siguiente enlace: %0A" +
        "raffly.com.mx/verificador/" +
        boleto.email
    );
  };

  const formatDate = (dateValue) => {
    const date = new Date(dateValue); // Convert to Date object
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      {socioMetaData[0] ? (
        <>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div
              className="ticket"
              style={{
                backgroundColor: "#3D3D3D",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              {boleto.comprado === true ? (
                <aside
                  style={{
                    color: "#6FCF85",
                    color: "#6FCF85",
                    height: "1.2em",

                    overflow: "hidden",
                  }}
                >
                  {boleto.nombre_rifa}
                </aside>
              ) : (
                <aside style={{ color: "#DC3545" }}>Pago pendiente</aside>
              )}

              <section className="ticket__first-section">
                <section>
                  <img
                    onClick={() =>
                      navigate(
                        "/" +
                          encodeURIComponent(
                            boleto.socio.replace(/\s+/g, "-")
                          ) +
                          "/" +
                          boleto.socio_user_id
                      )
                    }
                    src={socioMetaData[0].image_url}
                    alt="logo"
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                  <h4
                    onClick={() =>
                      navigate(
                        "/" +
                          encodeURIComponent(
                            boleto.socio.replace(/\s+/g, "-")
                          ) +
                          "/" +
                          boleto.socio_user_id
                      )
                    }
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  >
                    {boleto.socio}
                  </h4>
                </section>

                <section>
                  <strong style={{ fontSize: "16px" }}>
                    Numeros:{" "}
                    <span style={{ fontSize: "11px" }}>
                      {" "}
                      {numBoletosString}
                    </span>
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

                  {boleto.estado_mx ? (
                    <>
                      <li>
                        <p>
                          <strong>ESTADO:</strong>
                        </p>
                        <p>{boleto.estado_mx}</p>
                      </li>
                    </>
                  ) : null}

                  <li>
                    <p>
                      <strong>PAGO:</strong>
                    </p>
                    <p>
                      {boleto.comprado === true
                        ? "Pagado"
                        : boleto.apartado === true
                        ? "Apartado pago pendiente"
                        : boleto.oxxo === true
                        ? "Pago con oxxo pendiente"
                        : "Pago pendiente"}
                    </p>
                  </li>
                  <li>
                    {boleto.fecharifa ? (
                      <>
                        <p>
                          <strong>FECHA:</strong>
                        </p>
                        <p>{formatDate(boleto.fecharifa)}</p>
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>FECHA:</strong>
                        </p>
                        <p>
                          La fecha sera fijada al liquidar 80% de los boletos
                        </p>
                      </>
                    )}
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
                ) : boleto.oxxo === true ? (
                  <h4>¡PAGO PENDIENTE OXXO!</h4>
                ) : boleto.apartado === true ? (
                  <h4>¡PAGO PENDIENTE!</h4>
                ) : null}
              </section>

              {boleto.comprado === true ? (
                <aside
                  style={{
                    color: "#6FCF85",
                    height: "1.2em",

                    overflow: "hidden",
                  }}
                >
                  {boleto.nombre_rifa}
                </aside>
              ) : (
                <aside style={{ color: "#DC3545" }}>Pago pendiente</aside>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: "60px",
              }}
            >
              {boleto.comprado === true ? (
                <h4 style={{ height: "90px" }}> </h4>
              ) : boleto.oxxo === true ? (
                <>
                  <div style={{ marginLeft: "60px" }}>
                    <CountdownTimer fecha={boleto.apartado_fecha} />
                  </div>

                  <OxxoPaymentStatus boleto={boleto} />
                </>
              ) : boleto.apartado === true ? (
                <>
                  <div style={{ marginLeft: "60px" }}>
                    <CountdownTimer fecha={boleto.apartado_fecha} />
                  </div>
                  <button
                    style={{
                      justify: "center",
                      display: "flex",
                      margin: "0 auto",
                      padding: "10px 20px",
                      backgroundColor: "#007BFF",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                    onClick={handlePagarTransferencia}
                  >
                    Pagar boleto
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default BoletosList;
