import { useUser } from "../../UserContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import AccountMenu from "../../components/AccountMenu";
import SideBarMobile from "./SideBarMobile";

//import navHome.css

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userMetaData } = useUser();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      {userMetaData[0] ? (
        <>
          <header
            style={{
              backgroundColor: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
            className="topbar"
          >
            <div className="ham-topbar">
              <i onClick={toggleSidebar} className="material-icons">
                {" "}
                menu
              </i>
            </div>
            <h1
              className="topbar-title"
              style={{
                color: "white",
                fontWeight: "bold",
                fontFamily: "Poppins",
              }}
            >
              Panel de {userMetaData[0].nombre_negocio}
            </h1>

            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onClick={toggleMenu}
            >
              <i className="material-icons">account_circle</i>
              {user.user_metadata.name}
            </div>

            {isMenuOpen && <AccountMenu onClose={closeMenu} user={user} />}
          </header>
          <SideBarMobile isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      ) : null}
    </>
  );
};

export default Topbar;
