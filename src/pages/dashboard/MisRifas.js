import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Switch from "react-switch";
import { useUser } from "../../UserContext";

//import components

import RifaListDashboard from "../../components/RifaListDashboard";
import { Margin } from "@mui/icons-material";
//import css
import "./MisRifas.css";
import RifaList from "../../components/RifaList";

const MisRifas = () => {
  const { user_id } = useParams();
  const [fetchError, setFetchError] = useState(null);
  const [rifas, setRifas] = useState(null);
  const { userMetaData } = useUser(null);

  console.log(rifas);

  const [accountExists, setAccountExists] = useState("default");

  const [creditos, setCreditos] = useState(null);

  const navigate = useNavigate();

  const handleDelete = (id) => {
    setRifas((prevRifas) => {
      return prevRifas.filter((rifa) => rifa.id !== id);
    });
  };

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
    checkAccountSetup();
    fetchCreditos();
  }, [user_id]);

  const fetchCreditos = async () => {
    const { data, error } = await supabase
      .from("user_metadata")
      .select("creditos")
      .eq("user_id", user_id);
    if (error) {
      console.log(error);
    }
    if (data) {
      setCreditos(data);
    }
  };

  const checkAccountSetup = async () => {
    try {
      const response = await fetch(
        "https://www.raffly.com.mx/api/check-account-exists",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountId: userMetaData[0].stripe_id }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.exists) {
          console.log(
            "Account exists!",
            "Payments active:",
            data.paymentsActive
          );
          if (data.paymentsActive === true) {
            setAccountExists("true");
          }
        } else {
          console.log("Account does not exist.");
        }
      } else {
        console.error("Error checking account existence:", data.error);
      }
    } catch (error) {
      console.error("Error checking account existence:", error);
    }
  };

  const toggleRifaStatus = async (rifa) => {
    const confirm = window.confirm(
      "¿Seguro que quieres cambiar el estado de esta rifa?"
    );

    if (!confirm) {
      return;
    }

    const { data, error } = await supabase
      .from("rifas")
      .update({ status: !rifa.status })
      .eq("id", rifa.id);
    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
    }
    window.location.reload();
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <div className="titulo-mis-rifas">
          <h1> Tus Rifas </h1>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {creditos !== null ? (
              creditos[0].creditos > 0 ? (
                <>
                  {" "}
                  <h3>Crear Rifa</h3>
                  <i
                    style={{
                      cursor: "pointer",
                      marginLeft: "10px",
                      backgroundColor: "#6FCF85",
                      color: "white",
                      borderRadius: "50%",
                      padding: "10px",
                      fontSize: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                    }}
                    onClick={() =>
                      navigate("/dashboard/" + user_id + "/crear-rifa")
                    }
                    className="material-icons"
                  >
                    add
                  </i>
                  <p>Creditos: {creditos[0].creditos}</p>
                </>
              ) : (
                <>
                  No tienes mas creditos contacta a soporte para agregar mas.
                  <button
                    onClick={() =>
                      window.open(
                        "https://api.whatsapp.com/send/?phone=" +
                          "+526143035198" +
                          "&text=Quiero agregar creditos"
                      )
                    }
                  >
                    Contactar
                  </button>
                </>
              )
            ) : (
              <>
                No tienes mas creditos contacta a soporte para agregar mas.
                <button
                  onClick={() =>
                    window.open(
                      "https://api.whatsapp.com/send/?phone=" +
                        "+526143035198" +
                        "&text=Quiero agregar creditos"
                    )
                  }
                >
                  Contactar
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          {fetchError && <p>{fetchError}</p>}

          {rifas && (
            <div className="mis-rifas-grid">
              {rifas.map((rifa, index) => (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <RifaList key={index} rifa={rifa} />
                    {rifa.status === true ? (
                      <>
                        <p
                          style={{
                            fontSize: "21px",
                            backgroundColor: "#6FCF85",
                            padding: "10px",
                            borderRadius: "10px",
                            color: "white",
                            position: "relative",
                            right: "-80px",
                            top: "0px",
                            zIndex: "10",
                          }}
                        >
                          Rifa Activa
                        </p>
                        <div
                          style={{
                            position: "relative",
                            right: "-80px",
                            top: "0px",
                            zIndex: "10",
                          }}
                        >
                          {" "}
                          <Switch
                            onChange={() => toggleRifaStatus(rifa)}
                            checked={rifa.status}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p
                          style={{
                            fontSize: "21px",
                            color: "white",
                            padding: "10px",
                            borderRadius: "10px",
                            backgroundColor: "red",
                            position: "relative",
                            right: "-80px",
                            top: "0px",
                            zIndex: "10",
                          }}
                        >
                          Rifa Inactiva
                        </p>
                        <div
                          style={{
                            position: "relative",
                            right: "-80px",
                            top: "0px",
                            zIndex: "10",
                          }}
                        >
                          {" "}
                          <Switch
                            onChange={() => toggleRifaStatus(rifa)}
                            checked={rifa.status}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MisRifas;
