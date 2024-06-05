import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

//import sidebar css

const Sidebar = () => {
  const { user_id } = useParams();
  return (
    <>
      <aside className="sidebar">
        <img
          className="nav-sidebar-img"
          height={150}
          src="https://cdn.builder.io/api/v1/image/assets%2F471f30dc7fc44194a6a6e33e22d8a6a9%2Fc1a175f6985f474398d722b4cbbbda9d"
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
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
