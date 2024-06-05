import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

//import components

import RifaListDashboard from "../../components/RifaListDashboard";
//import css

const MisRifas = () => {
  const { user_id } = useParams();
  const [fetchError, setFetchError] = useState(null);
  const [rifas, setRifas] = useState(null);

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
  }, [user_id]);

  return (
    <div className="dashboard-content">
      <div>
        {fetchError && <p>{fetchError}</p>}
        <h1> Tus Rifas </h1>
        <button
          onClick={() => navigate("/dashboard/" + user_id + "/crear-rifa")}
        >
          {" "}
          Crear Rifa{" "}
        </button>

        {rifas && (
          <div className="rifas-grid">
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
