import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const Sidebar = () => {
  const { user_id } = useParams();
  return (
    <>
      <aside className="sidebar">
        <img
          height={150}
          src="https://cdn.builder.io/api/v1/image/assets%2F471f30dc7fc44194a6a6e33e22d8a6a9%2Fc1a175f6985f474398d722b4cbbbda9d"
        ></img>
        <nav>
          <ul>
            <li>
              <Link to={"/dashboard/" + user_id}>Dashboard</Link>
            </li>
            <li>
              <Link to="my-raffles">My Raffles</Link>
            </li>
            <li>
              <Link to="/">Main Home</Link>
            </li>
            <li>
              <Link to="crear-rifa">Crear Rifa</Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
