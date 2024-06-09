import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";

import { useState, useEffect } from "react";

import RifaList from "../components/RifaList";

import HeaderSocios from "../components/HeaderSocios";

//import SocioArchive.css
import "../css/Single-Socios/SocioArchive.css";

const SingleSocio = () => {
  const { user_id } = useParams();

  const [fetchError, setFetchError] = useState(null);
  const [rifas, setRifas] = useState(null);

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
  }, []);

  return (
    <>
      <HeaderSocios />

      <div className="div-grid-archive">
        <div>
          {fetchError && <p>{fetchError}</p>}
          <h1>Rifas Activas </h1>
          <hr className="divider-title" />

          {rifas && (
            <div className="rifas-grid-archive">
              {rifas.map((rifa) => (
                <RifaList key={rifa.id} rifa={rifa} boletosVendidos={450} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SingleSocio;
