import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useUser } from "../../UserContext";

//import sidebar css

const Sidebar = () => {
  const { user_id } = useParams();
  const { userMetaData } = useUser();
  console.log(userMetaData);

  return (
    <>
      <aside className="sidebar">
        {userMetaData[0] ? (
          <>
            <img
              className="nav-sidebar-img"
              height={150}
              src={userMetaData[0].image_url}
              alt="User"
            />
            <nav className="nav-sidebar">
              <ul className="nav-sidebar-ul">
                <li>
                  <Link
                    className="nav-sidebar-item"
                    to={
                      "/" +
                      encodeURIComponent(
                        userMetaData[0].nombre_negocio.replace(/\s+/g, "-")
                      ) +
                      "/" +
                      encodeURIComponent(
                        userMetaData[0].user_id.replace(/\s+/g, "-")
                      )
                    }
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    className="nav-sidebar-item"
                    to={"/dashboard/" + user_id}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="nav-sidebar-item" to="mis-rifas">
                    Mis Rifas
                  </Link>
                </li>
                <li>
                  <Link className="nav-sidebar-item" to="stripe-config">
                    Stripe
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="sidebar-bottom">
              <Link className="nav-sidebar-item" to="config">
                <i className="material-icons">settings</i>Config
              </Link>
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
};

export default Sidebar;
