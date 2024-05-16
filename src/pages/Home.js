import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";

import "../css/index.css";
import "../css/NavHome.css";

//componentes
import RifaList from "../components/RifaList";

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [rifas, setRifas] = useState(null);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

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

  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          console.log(value);
          setUser(value.data.user);
        }
      });
    }
    getUserData();
  }, []);

  //{user.identities[0].identity_data.name}

  const HeaderHome = ({ cartCount }) => {
    return (
      <header className="header-home">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 className="logo-title">Raffly</h1>
        </Link>

        <nav className="nav-home">
          <ul className="nav-home-ul">
            <li>
              <Link className="nav-home-item" to="/">
                Inicio
              </Link>
            </li>
            <li>
              <Link className="nav-home-item" to="/create">
                Crear Nueva Rifa
              </Link>
            </li>

            <li>
              <Link className="nav-home-item" to={"/cart"}>
                <i className="material-icons">local_mall</i>
                <sub>{cartCount}</sub>
              </Link>
            </li>

            <li>
              <Link className="nav-home-item" to="/login">
                <i className="material-icons">account_circle</i>
              </Link>

              <Link className="nav-home-item" to="/success">
                {user.email}
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  };

  const HeaderContainer = () => {
    const { cartCount } = useCart();
    return <HeaderHome cartCount={cartCount} />;
  };

  return (
    <>
      <HeaderContainer textDecoration="none" />
      <div className="hero">
        <h1>Bienvenido a Raffly!</h1>

        <hr className="solid"></hr>
        <h2>
          {" "}
          Participa para ganar increíbles premios! <br></br>Carros, Celulares,
          Relojes, Efectivo y Mucho Más. <br></br> <br></br>Registrate y empieza
          a ganar ya!{" "}
        </h2>
        {Object.keys(user).length > 0 ? (
          <button>Ver Rifas</button>
        ) : (
          <button onClick={() => navigate("/login")}>Registrarse</button>
        )}
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
