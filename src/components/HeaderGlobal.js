//import HeaderGlobal.css
import "./HeaderGlobal.css";

import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../UserContext";

import AccountMenu from "./AccountMenu";

import { useCart } from "../CartContext";

const HeaderGlobal = () => {
  const { user_id, nombre_negocio } = useParams();

  const [socioMetaData, setSocioMetaData] = useState([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount, cart } = useCart();

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleHamburger = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeHamburger = () => {
    setIsHamburgerOpen(false);
  };

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, userRole } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserMetaData = async () => {
      if (!user_id) return;

      const { data, error } = await supabase
        .from("user_metadata")
        .select()
        .eq("user_id", user_id);

      if (error) {
        console.log(error);
      }
      if (data) {
        setSocioMetaData(data);

        //console.log(data);
      }
    };
    fetchUserMetaData();
  }, [user_id]);
  return (
    <>
      <header className="header-global">
        <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Raffly
        </h2>

        <div className="search">
          <input type="text" />
          <i
            style={{
              color: "#343a40",
              marginLeft: "-25px",
              transform: "scale(0.8)",
              position: "absolute",
              left: "280px",
              cursor: "pointer",
            }}
            className="material-icons"
          >
            search
          </i>
        </div>

        <div className="ham-menu">
          {socioMetaData[0] && (
            <>
              <i
                style={{
                  color: "white",
                  display: "flex",
                  cursor: "pointer",
                }}
                className="material-icons"
                onClick={() =>
                  navigate(
                    "/" +
                      encodeURIComponent(
                        socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                      ) +
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].user_id.replace(/\s+/g, "-")
                      ) +
                      "/carrito"
                  )
                }
              >
                local_mall
              </i>
              <p
                style={{
                  color: "white",
                  position: "relative",
                  top: "2px",
                  left: "-10px",
                  fontFamily: "Poppins",
                  backgroundColor: "red",
                  borderRadius: "100%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {cartCount}
              </p>
            </>
          )}
          {socioMetaData[0] === undefined && (
            <>
              {cartCount > 0 && (
                <i
                  style={{
                    color: "white",
                    display: "flex",
                    cursor: "pointer",
                  }}
                  className="material-icons"
                  onClick={() =>
                    navigate(
                      "/" +
                        encodeURIComponent(
                          cart[0].rifa.socio.replace(/\s+/g, "-")
                        ) +
                        "/" +
                        encodeURIComponent(
                          cart[0].rifa.user_id.replace(/\s+/g, "-")
                        ) +
                        "/carrito"
                    )
                  }
                >
                  local_mall
                </i>
              )}

              {cartCount === 0 && (
                <i
                  style={{
                    color: "white",
                    display: "flex",
                    cursor: "pointer",
                  }}
                  className="material-icons"
                  onClick={() => navigate("/carrito")}
                >
                  local_mall
                </i>
              )}

              <p
                style={{
                  color: "white",
                  position: "relative",
                  top: "2px",
                  left: "-10px",
                  fontFamily: "Poppins",
                  backgroundColor: "red",
                  borderRadius: "100%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {cartCount}
              </p>
            </>
          )}
          <i
            style={{
              color: "white",
              transform: "scale(1.2)",
              display: "flex",
            }}
            className="material-icons"
            onClick={toggleHamburger}
          >
            menu
          </i>
        </div>

        <div
          className={`mobile-menu-overlay ${isMobileMenuOpen ? "open" : ""}`}
          onClick={toggleHamburger}
        ></div>

        {socioMetaData[0] && (
          <nav className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
            <ul>
              {user ? (
                <>
                  <Link
                    style={{
                      textDecoration: "none",
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    className="nav-home-item"
                    to={"#"}
                    onClick={toggleMenu}
                  >
                    <i className="material-icons">account_circle</i>
                    {user.user_metadata.name}
                  </Link>
                  {isMenuOpen && (
                    <AccountMenu
                      onClose={closeMenu}
                      user={user}
                      socio_id={user_id}
                      nombre_negocio={nombre_negocio}
                    />
                  )}
                </>
              ) : (
                <Link
                  style={{
                    textDecoration: "none",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    gap: "0.5rem",
                  }}
                  className="nav-home-item"
                  to={
                    "/" +
                    encodeURIComponent(
                      socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                    ) +
                    "/" +
                    encodeURIComponent(
                      socioMetaData[0].user_id.replace(/\s+/g, "-")
                    ) +
                    "/login"
                  }
                >
                  <i
                    onClick={() =>
                      navigate(
                        "/" +
                          encodeURIComponent(
                            socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                          ) +
                          "/" +
                          encodeURIComponent(
                            socioMetaData[0].user_id.replace(/\s+/g, "-")
                          ) +
                          "/login"
                      )
                    }
                    className="material-icons"
                  >
                    account_circle
                  </i>
                  Iniciar Sesion
                </Link>
              )}
              <hr className="divider-title"></hr>

              {user ? (
                <li>
                  <a
                    href={
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                      ) +
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].user_id.replace(/\s+/g, "-")
                      ) +
                      "/mis-boletos"
                    }
                  >
                    Mis Boletos
                  </a>
                </li>
              ) : null}

              <li>
                <a
                  href={
                    "/" +
                    encodeURIComponent(
                      socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                    ) +
                    "/" +
                    encodeURIComponent(
                      socioMetaData[0].user_id.replace(/\s+/g, "-")
                    )
                  }
                >
                  Rifas
                </a>
              </li>

              <li>
                <a href="/socios">Socios</a>
              </li>

              <hr className="divider-title"></hr>

              <button
                style={{
                  marginTop: "1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                }}
                onClick={toggleHamburger}
              >
                Cerrar
              </button>
            </ul>
          </nav>
        )}

        {socioMetaData[0] && (
          <nav className="nav-menu-socio">
            <ul>
              {user ? (
                <li>
                  <a
                    href={
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                      ) +
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].user_id.replace(/\s+/g, "-")
                      ) +
                      "/mis-boletos"
                    }
                  >
                    Mis Boletos
                  </a>
                </li>
              ) : (
                <li>
                  <a
                    href={
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                      ) +
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].user_id.replace(/\s+/g, "-")
                      ) +
                      "/mis-boletos"
                    }
                  >
                    Verificador de boletos
                  </a>
                </li>
              )}

              <li>
                <a
                  href={
                    "/" +
                    encodeURIComponent(
                      socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                    ) +
                    "/" +
                    encodeURIComponent(
                      socioMetaData[0].user_id.replace(/\s+/g, "-")
                    )
                  }
                >
                  Rifas
                </a>
              </li>

              {userRole === "Admin" || userRole === "Socio" ? (
                <li
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "15px",
                    padding: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <a
                    style={{ color: "black", textDecoration: "none" }}
                    href={"/dashboard/" + user?.id}
                  >
                    Panel de socio
                  </a>
                </li>
              ) : null}

              <li>
                <Link
                  className="nav-home-item"
                  to={
                    "/" +
                    encodeURIComponent(
                      socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                    ) +
                    "/" +
                    encodeURIComponent(
                      socioMetaData[0].user_id.replace(/\s+/g, "-")
                    ) +
                    "/carrito"
                  }
                >
                  <i className="material-icons">local_mall</i>
                  <sub>{cartCount}</sub>
                </Link>
              </li>

              <li>
                {user ? (
                  <>
                    <Link
                      style={{
                        textDecoration: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                        gap: "0.5rem",
                      }}
                      className="nav-home-item"
                      to={"#"}
                      onClick={toggleMenu}
                    >
                      <i className="material-icons">account_circle</i>
                      {user.user_metadata.name}
                    </Link>
                    {isMenuOpen && (
                      <AccountMenu
                        onClose={closeMenu}
                        user={user}
                        socio_id={user_id}
                        nombre_negocio={nombre_negocio}
                      />
                    )}
                  </>
                ) : (
                  <Link
                    style={{
                      textDecoration: "none",
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                    className="nav-home-item"
                    to={
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                      ) +
                      "/" +
                      encodeURIComponent(
                        socioMetaData[0].user_id.replace(/\s+/g, "-")
                      ) +
                      "/login"
                    }
                  >
                    <i
                      onClick={() =>
                        navigate(
                          "/" +
                            encodeURIComponent(
                              socioMetaData[0].nombre_negocio.replace(
                                /\s+/g,
                                "-"
                              )
                            ) +
                            "/" +
                            encodeURIComponent(
                              socioMetaData[0].user_id.replace(/\s+/g, "-")
                            ) +
                            "/login"
                        )
                      }
                      className="material-icons"
                    >
                      account_circle
                    </i>
                    Iniciar Sesion
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        )}

        {socioMetaData[0] === undefined && (
          <nav className="nav-menu-socio">
            <ul>
              <li
                style={{
                  backgroundColor: "#ffa500",
                  color: "white",
                  borderRadius: "15px",
                  padding: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                }}
                onClick={() => navigate("/crear")}
              >
                <Link
                  style={{ color: "white", textDecoration: "none" }}
                  className="nav-home-item"
                  to={"/crear"}
                >
                  Crear Rifa
                </Link>
              </li>

              <li>
                <a href={"/rifas"}>Rifas</a>
              </li>
              <li>
                <a href={"/verificador"}>Verificador de boletos</a>
              </li>

              <li>
                <a href={"/socios"}>Socios</a>
              </li>

              <li>
                {cartCount > 0 ? (
                  <Link
                    className="nav-home-item"
                    to={
                      "/" +
                      encodeURIComponent(
                        cart[0].rifa.socio.replace(/\s+/g, "-")
                      ) +
                      "/" +
                      encodeURIComponent(
                        cart[0].rifa.user_id.replace(/\s+/g, "-")
                      ) +
                      "/carrito"
                    }
                  >
                    <i className="material-icons">local_mall</i>
                    <sub>{cartCount}</sub>
                  </Link>
                ) : (
                  <Link className="nav-home-item" to={"/carrito"}>
                    <i className="material-icons">local_mall</i>
                    <sub>{cartCount}</sub>
                  </Link>
                )}
              </li>

              {userRole === "Admin" || userRole === "Socio" ? (
                <li
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "15px",
                    padding: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                  }}
                  onClick={() => navigate("/dashboard/" + user?.id)}
                >
                  <a
                    style={{ color: "black", textDecoration: "none" }}
                    href={"/dashboard/" + user?.id}
                  >
                    Panel de socio
                  </a>
                </li>
              ) : null}

              <li>
                {user ? (
                  <>
                    <Link
                      style={{
                        textDecoration: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                        gap: "0.5rem",
                      }}
                      className="nav-home-item"
                      to={"#"}
                      onClick={toggleMenu}
                    >
                      <i className="material-icons">account_circle</i>
                      {user.user_metadata.name}
                    </Link>
                    {isMenuOpen && (
                      <AccountMenu
                        onClose={closeMenu}
                        user={user}
                        socio_id={user_id}
                        nombre_negocio={nombre_negocio}
                      />
                    )}
                  </>
                ) : (
                  <Link
                    style={{
                      textDecoration: "none",
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                    className="nav-home-item"
                    to={"/login"}
                  >
                    <i
                      onClick={() => navigate("/login")}
                      className="material-icons"
                    >
                      account_circle
                    </i>
                    Iniciar Sesion
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        )}

        {socioMetaData[0] === undefined && (
          <>
            <nav className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
              <ul>
                {user ? (
                  <>
                    <Link
                      style={{
                        textDecoration: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                        gap: "0.5rem",
                        marginBottom: "1rem",
                      }}
                      className="nav-home-item"
                      to={"#"}
                      onClick={toggleMenu}
                    >
                      <i className="material-icons">account_circle</i>
                      {user.user_metadata.name}
                    </Link>
                    {isMenuOpen && (
                      <AccountMenu
                        onClose={closeMenu}
                        user={user}
                        socio_id={undefined}
                        nombre_negocio={undefined}
                      />
                    )}
                  </>
                ) : (
                  <Link
                    style={{
                      textDecoration: "none",
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                    className="nav-home-item"
                    to={"/login"}
                  >
                    <i
                      onClick={() => navigate("/login")}
                      className="material-icons"
                    >
                      account_circle
                    </i>
                    Iniciar Sesion
                  </Link>
                )}
                <hr className="divider-title"></hr>

                {user ? (
                  <li>
                    <a href={"/verificador"}>Mis Boletos</a>
                  </li>
                ) : (
                  <li>
                    <a href={"/verificador"}>Verificador de boletos</a>
                  </li>
                )}

                <li>
                  <a href={"/rifas"}>Rifas</a>
                </li>

                <li>
                  <a href="/socios">Socios</a>
                </li>

                <hr className="divider-title"></hr>

                <button
                  style={{
                    marginTop: "1rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                  }}
                  onClick={toggleHamburger}
                >
                  Cerrar
                </button>
              </ul>
            </nav>
          </>
        )}
      </header>

      {socioMetaData[0] && (
        <div className="headerIfSocio">
          <div
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
            className="headerIfSocioLogo"
          >
            <img
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(
                  "/" +
                    encodeURIComponent(
                      socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                    ) +
                    "/" +
                    encodeURIComponent(
                      socioMetaData[0].user_id.replace(/\s+/g, "-")
                    )
                )
              }
              src={socioMetaData[0].image_url}
              className="img-logo"
            ></img>
            <img
              src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/verificado.png"
              className="verificado"
            ></img>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column" }}
            className="headerIfSocioMenu"
            onClick={() =>
              navigate(
                "/" +
                  encodeURIComponent(
                    socioMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                  ) +
                  "/" +
                  encodeURIComponent(
                    socioMetaData[0].user_id.replace(/\s+/g, "-")
                  )
              )
            }
          >
            <h1
              style={{
                fontSize: "27px",
                fontFamily: "Poppins",
                fontWeight: "bold",
                color: "white",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {socioMetaData[0].nombre_negocio}
            </h1>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderGlobal;

/*

<div
              style={{ display: "flex", flexDirection: "row", gap: "25px" }}
              className="headerIfSocionNav"
            >
              <p
                style={{
                  color: "white",
                  fontFamily: "Poppins",
                  fontSize: "18px",
                  fontWeight: "500",
                  backgroundColor: "#6FCF85",
                  borderRadius: "10px",
                  padding: "5px",
                  cursor: "pointer",
                }}
              >
                Rifas Activas
              </p>
              <p
                style={{
                  color: "white",
                  fontFamily: "Poppins",
                  fontSize: "18px",
                  fontWeight: "500",
                  backgroundColor: "#6FCF85",
                  borderRadius: "10px",
                  padding: "5px",
                  cursor: "pointer",
                }}
              >
                Mis Boletos
              </p>
            </div>

            */
