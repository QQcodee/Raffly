import HeaderSocios from "../components/HeaderSocios";
import supabase from "../config/supabaseClient";
import BoletosList from "../components/BoletosList";

import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import HeaderGlobal from "../components/HeaderGlobal";
import FooterGloal from "../components/FooterGlobal";

const MisBoletos = () => {
  const { user } = useUser();
  const { user_id, nombre_negocio } = useParams();
  const [boletos, setBoletos] = useState([]);

  const [buscarBoleto, setBuscarBoleto] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoletos = async () => {
      const { data, error } = await supabase

        .from("boletos")
        .select()
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setBoletos(data);
      }
    };
    fetchBoletos();
  }, [user]);

  const handleBuscarBoleto = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("boletos")
      .select()
      .eq("email", buscarBoleto)
      .eq("socio_user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    }

    if (data) {
      setBoletos(data);
    }
  };

  return (
    <>
      <HeaderGlobal />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
          flexDirection: "column",
        }}
      >
        <h1 style={{ textAlign: "left", marginLeft: "40px" }}>Mis Boletos</h1>

        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <form
              style={{ display: "flex", alignItems: "center" }}
              onSubmit={handleBuscarBoleto}
            >
              <input
                type="text"
                id="nombreInput"
                placeholder="Buscar boleto por email"
                value={buscarBoleto}
                onChange={(e) => setBuscarBoleto(e.target.value)}
                style={{
                  width: "250px",
                  color: "black",
                  padding: "10px",
                  margin: "10px",
                  borderRadius: "15px",
                  border: "1px solid #ccc",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              />

              <button type="submit">Buscar Boleto</button>
            </form>
          </div>
        </div>
      </div>
      {boletos && (
        <div className="boletos-grid-archive">
          {boletos.map((boleto) => (
            <BoletosList key={boleto.id} boleto={boleto} />
          ))}
        </div>
      )}

      {user ? (
        boletos.length === 0 ? (
          <>
            <h1 style={{ textAlign: "center", fontFamily: "Poppins" }}>
              No tienes boletos comprados
            </h1>

            <div
              style={{
                alignContent: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                style={{
                  borderRadius: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  margin: "10px",
                  marginTop: "20px",
                  marginBottom: "20px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease",
                }}
                onClick={() =>
                  navigate(
                    "/" +
                      encodeURIComponent(nombre_negocio.replace(/\s+/g, "-")) +
                      "/" +
                      encodeURIComponent(user_id.replace(/\s+/g, "-"))
                  )
                }
              >
                Ir a rifas Activas
              </button>
            </div>
            <div style={{ height: "50vh" }}></div>
          </>
        ) : null
      ) : null}

      <FooterGloal />
    </>
  );
};

export default MisBoletos;
