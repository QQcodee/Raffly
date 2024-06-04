//import HeaderHome from "../../components/HeaderHome";
//import { useCart } from "../../CartContext";
import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import HeaderLogin from "../HeaderLogin";
import RifaListDashboard from "../../components/RifaListDashboard";
import HeaderDashboard from "../../components/HeaderDashboard";

const Dashboard = () => {
  const { user_id } = useParams();
  const [fetchError, setFetchError] = useState(null);
  const [rifas, setRifas] = useState(null);
  console.log(user_id);

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
    <>
      <div>
        <HeaderLogin />

        <div className="page home">
          {fetchError && <p>{fetchError}</p>}
          <h1> Bienvenido a Raffly </h1>
          {rifas && (
            <div className="rifas-grid">
              {rifas.map((rifa) => (
                <RifaListDashboard
                  key={rifa.id}
                  rifa={rifa}
                  user_id={user_id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
