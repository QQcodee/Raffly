import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

//import css
import "../css/index.css";
import "../css/NavHome.css";

//import components
import HeaderHome from "../components/HeaderHome";
import RifaList from "../components/RifaList";

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [rifas, setRifas] = useState(null);
  const { user, userRole } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRifas = async () => {
      const { data, error } = await supabase.from("rifas").select();

      if (error) {
        setFetchError("Could not fetch rifas");
        setRifas(null);
        console.log(error);
      } else {
        setRifas(data);
        setFetchError(null);
      }
    };

    fetchRifas();
  }, []);

  console.log(rifas);
  return (
    <>
      <HeaderHome textDecoration="none" />

      <div className="hero">
        <h1>Bienvenido a Raffly!</h1>

        <hr className="solid"></hr>
        <h2>
          Participa para ganar increíbles premios! <br />
          Carros, Celulares, Relojes, Efectivo y Mucho Más. <br /> <br />
          Registrate y empieza a ganar ya!
        </h2>
        {user ? (
          <button onClick={() => navigate("/rifas")}>Ver Rifas</button>
        ) : (
          <button onClick={() => navigate("/login")}>Registrarse</button>
        )}
      </div>

      <div className="page-home">
        {fetchError && <p>{fetchError}</p>}
        <h1>Bienvenido a Raffly</h1>
        {rifas && (
          <div className="rifas-grid">
            {rifas.map((rifa) => (
              <RifaList key={rifa.id} rifa={rifa} boletosVendidos={450} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
