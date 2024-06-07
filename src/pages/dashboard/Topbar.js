import { useUser } from "../../UserContext";

const Topbar = () => {
  const { userMetaData } = useUser();
  return (
    <header className="topbar">
      <h1>Dashboard de {userMetaData[0].nombre_negocio}</h1>
    </header>
  );
};

export default Topbar;
