import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useUser } from "../../UserContext";
import supabase from "../../config/supabaseClient";
import { useEffect, useState } from "react";

//import sidebar css

const Sidebar = () => {
  const { user_id } = useParams();
  const { userRole } = useUser();

  const [userMetaData, setUserMetaData] = useState();

  useEffect(() => {
    if (!user_id) {
      return;
    }
    const fetchUserMetaData = async () => {
      const { data, error } = await supabase
        .from("user_metadata")
        .select()
        .eq("user_id", user_id)
        .single();
      if (error) {
        console.error("Error fetching user metadata:", error.message);
        return;
      }
      setUserMetaData(data);
    };
    fetchUserMetaData();
  }, [user_id]);

  return (
    <>
      <aside className="sidebar">
        {userMetaData ? (
          <>
            <img
              className="nav-sidebar-img"
              height="150px"
              width="150px"
              src={userMetaData.image_url}
              alt="User"
              style={{
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                border: "1px solid #ccc",
              }}
            />
            <nav
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "50px",
              }}
            >
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  listStyle: "none",
                  padding: 0,
                  alignItems: "flex-start",
                }}
              >
                <li>
                  <Link
                    className="nav-sidebar-item"
                    to={"/dashboard/" + user_id}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    <i className="material-icons">bar_chart</i>
                    Estadisticas
                  </Link>
                </li>
                <li>
                  <Link
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                    className="nav-sidebar-item"
                    to="mis-rifas"
                  >
                    <i className="material-icons">add_circle </i>
                    Rifas
                  </Link>
                </li>

                <li>
                  <Link
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                    className="nav-sidebar-item"
                    to="boletos"
                  >
                    <i className="material-icons">confirmation_number</i>
                    Boletos
                  </Link>
                </li>

                {userRole === "Admin" && (
                  <li>
                    <Link
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        justifyContent: "center",
                      }}
                      className="nav-sidebar-item"
                      to="admin-panel"
                    >
                      <i className="material-icons">manage_accounts</i>
                      Panel de Admin
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            <div className="sidebar-bottom">
              <button
                onClick={() =>
                  (window.location.href =
                    "/" +
                    encodeURIComponent(
                      userMetaData.nombre_negocio.replace(/\s+/g, "-")
                    ) +
                    "/" +
                    encodeURIComponent(
                      userMetaData.user_id.replace(/\s+/g, "-")
                    ))
                }
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 20px",

                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginBottom: "20px",

                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                  width: "100%",
                }}
              >
                <i className="material-icons">arrow_back</i>Salir del panel
              </button>
              <Link
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",
                }}
                className="nav-sidebar-item"
                to="config"
              >
                <i className="material-icons">settings</i>Config
              </Link>

              {userRole === "Socio" ||
                (userRole === "Admin" && (
                  <Link
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                    className="nav-sidebar-item"
                    to="stripe-config"
                  >
                    <i className="material-icons">add_card</i>
                    Stripe
                  </Link>
                ))}
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
};

export default Sidebar;
