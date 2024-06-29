import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

//import css
import "../css/index.css";

//import components
import HeaderHome from "../components/HeaderHome";
import RifaList from "../components/RifaList";
import HeaderGlobal from "../components/HeaderGlobal";
import FooterGlobal from "../components/FooterGlobal";

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

  //console.log(rifas);
  return (
    <>
      <div>
        <HeaderGlobal />
      </div>
      <FooterGlobal />
    </>
  );
};

export default Home;

/*

<div className="hero">
        <h1>Bienvenido a Raffly!</h1>

        <hr className="solid"></hr>
        <h2>
          La Mejor Plataforma de Rifas <br />
          Rifas Online Hechas Fáciles: Crea y Gana Sin Restricciones. <br />{" "}
          <br />
          ¡Únete ahora y comienza tu primera rifa hoy mismo!
        </h2>
        {user ? (
          <button onClick={() => navigate("/rifas")}>Ver Rifas</button>
        ) : (
          <button onClick={() => navigate("/login")}>Registrarse</button>
        )}
      </div>
      <div>
        <h2>Como funciona?</h2>
      </div>
      <div
        style={{
          backgroundColor: "#DAECFF",
        }}
      >
        <div className="div-grid-home">
          {fetchError && <p>{fetchError}</p>}
          <h1>Bienvenido a Raffly</h1>
          {rifas && (
            <div className="rifas-grid-home">
              {rifas.map((rifa) => (
                <RifaList key={rifa.id} rifa={rifa} boletosVendidos={450} />
              ))}
            </div>
          )}
        </div>
      </div>

      */
