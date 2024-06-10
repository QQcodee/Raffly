import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useUser } from "../../UserContext";

//import sidebar css

const Sidebar = () => {
  const { user_id } = useParams();
  const { userMetaData } = useUser();

  return (
    <>
      <aside className="sidebar">
        <img
          className="nav-sidebar-img"
          height={150}
          src={userMetaData[0].image_url}
        />

        <nav className="nav-sidebar">
          <ul className="nav-sidebar-ul">
            <li>
              <Link className="nav-sidebar-item" to="/">
                Inicio
              </Link>
            </li>
            <li>
              <Link className="nav-sidebar-item" to={"/dashboard/" + user_id}>
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
      </aside>
    </>
  );
};

export default Sidebar;
