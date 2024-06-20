import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

const AccountMenu = ({ onClose, user, socio_id, nombre_negocio }) => {
  const navigate = useNavigate();
  async function logout() {
    if (socio_id !== null && nombre_negocio !== null) {
      const { error } = await supabase.auth.signOut();
      navigate("/" + nombre_negocio + "/" + socio_id);
    } else {
      const { error } = await supabase.auth.signOut();
      navigate("/");
    }
  }
  return (
    <div className="account-menu">
      <ul>
        <li
          style={{
            fontWeight: "bold",
            fontSize: "12px",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <i href="/success" className="material-icons">
            account_circle
          </i>

          {user.user_metadata.name}
        </li>

        <li
          onClick={() =>
            navigate(
              "/" +
                encodeURIComponent(nombre_negocio.replace(/\s+/g, "-")) +
                "/" +
                encodeURIComponent(socio_id.replace(/\s+/g, "-")) +
                "/perfil"
            )
          }
        >
          Mi Cuenta
        </li>
        <li
          onClick={() =>
            navigate(
              "/" +
                encodeURIComponent(nombre_negocio.replace(/\s+/g, "-")) +
                "/" +
                encodeURIComponent(socio_id.replace(/\s+/g, "-")) +
                "/mis-boletos"
            )
          }
        >
          Mis Boletos
        </li>
        <li>Configuracion</li>
        <li>Facturacion</li>
        <li onClick={logout}>Cerrar Sesion</li>
      </ul>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default AccountMenu;
