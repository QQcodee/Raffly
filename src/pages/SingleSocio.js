import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";

import { useState, useEffect } from "react";

import RifaList from "../components/RifaList";
import { useNavigate } from "react-router-dom";

import HeaderSocios from "../components/HeaderSocios";

import Faq from "../components/Faq";

//import SingleSocio.css
import "../css/Single-Socios/SingleSocios.css";

const SingleSocio = () => {
  const { user_id } = useParams();

  const [fetchError, setFetchError] = useState(null);
  const [rifas, setRifas] = useState(null);

  const [socioMetaData, setSocioMetaData] = useState("");

  const navigate = useNavigate();

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

  useEffect(
    () => async () => {
      const fetchSocioMetaData = async () => {
        const { data, error } = await supabase
          .from("user_metadata")
          .select()
          .eq("user_id", user_id);

        if (error) {
          console.log(error);
        }
        if (data) {
          setSocioMetaData(data);
        }
      };

      fetchSocioMetaData();
    },
    [user_id, rifas]
  );

  return (
    <>
      <HeaderSocios />

      <div className="div-grid-archive">
        {fetchError && <p>{fetchError}</p>}
        <div className="rifas-title">
          <h2>Rifas Activas </h2>
          <hr className="divider-title-rifas-activas" />
        </div>

        {rifas && (
          <div className="rifas-grid-archive">
            {rifas.map((rifa) => (
              <RifaList key={rifa.id} rifa={rifa} />
            ))}
          </div>
        )}
      </div>
      <Faq socioMetaData={socioMetaData} />

    </>
  );
};

export default SingleSocio;
