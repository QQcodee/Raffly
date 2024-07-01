import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import supabase from "../config/supabaseClient";

const OxxoPaymentStatus = ({ boleto }) => {
  const [status, setStatus] = useState("default");
  const [error, setError] = useState(null);

  const fetchPaymentStatus = async () => {
    setStatus("cargando...");
    const oxxo_id = boleto.oxxo_id;

    try {
      const response = await axios.post(
        "https://www.raffly.com.mx/api/payment-status-oxxo",
        { oxxo_id }
      );

      const data = response.data; // Axios already parses JSON

      if (data.status === "succeeded") {
        setStatus("Pagado");
        handleSuccesfulStatus(); // Ensure handleSuccesfulStatus is defined
      } else if (data.status === "requires_action") {
        setStatus("Pendiente de pago");
      } else {
        setStatus("Desconocido");
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
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => fetchPaymentStatus()}
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
              backgroundColor: "#007BFF",
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
            onClick={() => fetchPaymentStatus()}
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
