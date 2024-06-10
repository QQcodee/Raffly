import { useUser } from "../../UserContext";

const Topbar = () => {
  const { userMetaData } = useUser();
  return (
    <header className="topbar">
      {userMetaData[0] ? (
        <h1>Dashboard de {userMetaData[0].nombre_negocio}</h1>
      ) : null}
    </header>
  );
};

export default Topbar;
