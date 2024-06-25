import { useState } from "react";
import axios from "axios";
import supabase from "../config/supabaseClient";

const OxxoPaymentStatus = ({ boleto }) => {
  const oxxo_id = boleto.oxxo_id;
  const [status, setStatus] = useState("default");
  const [error, setError] = useState(null);

  const fetchPaymentStatus = async (oxxo_id = null) => {
    setStatus("cargando...");
    try {
      const response = await fetch(
        `https://www.raffly.com.mx/api/payment-status-oxxo/${oxxo_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch payment status");
      }
      const data = await response.json();
      if (data.status === "succeeded") {
        setStatus("Pagado");
        handleSuccesfulStatus();
      } else if (data.status === "requires_action") {
        setStatus("Pendiente de pago");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSuccesfulStatus = async () => {
    const { data, error } = await supabase
      .from("boletos")
      .update({ comprado: true })
      .eq("id", boleto.id);

    if (error) {
      console.error("Error updating data: ", error);
    } else {
      console.log("Data updated successfully: ", data);
      window.location.reload();
    }
  };

  const handleRedirect = () => {
    window.open(boleto.oxxo_url);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {status === "default" && (
        <button
          style={{
            justify: "center",
            display: "flex",
            margin: "0 auto",
            padding: "10px 20px",
            backgroundColor: "#6fcf85",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => fetchPaymentStatus(oxxo_id)}
        >
          Verificar estado pago oxxo
        </button>
      )}

      {status === "Pendiente de pago" && (
        <>
          <button
            style={{
              justify: "center",
              display: "flex",
              margin: "0 auto",
              padding: "10px 20px",
              backgroundColor: "#6fcf85",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={handleRedirect}
          >
            Pagar
          </button>
          <i
            onClick={() => fetchPaymentStatus(oxxo_id)}
            style={{ cursor: "pointer" }}
            className="material-icons"
          >
            replay
          </i>
        </>
      )}
    </div>
  );
};

export default OxxoPaymentStatus;
