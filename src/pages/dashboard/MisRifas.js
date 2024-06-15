import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useUser } from "../../UserContext";

//import components

import RifaListDashboard from "../../components/RifaListDashboard";
import { Margin } from "@mui/icons-material";
//import css

const MisRifas = () => {
  const { user_id } = useParams();
  const [fetchError, setFetchError] = useState(null);
  const [rifas, setRifas] = useState(null);
  const { userMetaData } = useUser();

  const [accountExists, setAccountExists] = useState("default");

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
  }, [user_id]);

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

  return (
    <div className="dashboard-content">
      <div>
        {fetchError && <p>{fetchError}</p>}
        <h1> Tus Rifas </h1>
        {accountExists === "default" ? (
          <p>Cargando...</p>
        ) : accountExists === "true" ? (
          <button
            onClick={() => navigate("/dashboard/" + user_id + "/crear-rifa")}
          >
            {" "}
            Crear Rifa{" "}
          </button>
        ) : (
          <p>Para crear rifas debes configurar tu cuenta</p>
        )}

        {rifas && (
          <div style={{ marginLeft: "10px" }} className="rifas-grid">
            {rifas.map((rifa) => (
              <RifaListDashboard
                key={rifa.id}
                rifa={rifa}
                user_id={user_id}
                onDelete={handleDelete}
                boletosVendidos={450}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisRifas;
