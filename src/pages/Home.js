import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import "../css/index.css";
import "../css/NavHome.css";
import RifaList from "../components/RifaList";

//import components
import HeaderHome from "../components/HeaderHome";
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

  /*
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
              {user && (
                <Link className="nav-home-item" to="/success">
                  {user.email}
                </Link>
              )}
            </li>

            {userRole === "Admin" || userRole === "Socio" ? (
              <button
                onClick={() => navigate(`/dashboard/${user?.id}`)}
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                  border: "none",
                  backgroundColor: "White",
                  cursor: "pointer",
                  fontSize: "20px",
                  padding: "10px",
                  borderRadius: "10px",
                  marginLeft: "10px",
                }}
              >
                Panel de control
              </button>
            ) : null}
          </ul>
        </nav>
      </header>
    );
  };

  const HeaderContainer = () => {
    const { cartCount } = useCart();
    return <HeaderHome cartCount={cartCount} />;
  };

  */

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

      <div className="page home">
        {fetchError && <p>{fetchError}</p>}
        <h1>Bienvenido a Raffly</h1>
        {rifas && (
          <div className="rifas-grid">
            {rifas.map((rifa) => (
              <RifaList
                key={rifa.id}
                rifa={rifa}
                role={userRole}
                user_id={user?.id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
