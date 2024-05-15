import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";

//componentes
import RifaList from "../components/RifaList";

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [rifas, setRifas] = useState(null);

  useEffect(() => {
    const fetchRifas = async () => {
      const { data, error } = await supabase.from("Rifas").select();

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
      <div className="hero">
        <h1> Bienvenido a Raffly! </h1>
        <hr className="solid"></hr>
        <h2>
          {" "}
          Participa para ganar increíbles premios! <br></br>Carros, Celulares,
          Relojes, Efectivo y Mucho Más. <br></br> <br></br>Registrate y empieza
          a ganar ya!{" "}
        </h2>
        <button> Registrate </button>
      </div>

      <div className="page home">
        {fetchError && <p>{fetchError}</p>}
        <h1> Bienvenido a Raffly </h1>
        {rifas && (
          <div className="rifas-grid">
            {rifas.map((rifa) => (
              <RifaList key={rifa.id} rifa={rifa} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
