import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Assuming you are using React Router
import { useCart } from "../CartContext";
import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";

import { useUser } from "../UserContext";

import "../css/index.css";
import "../css/NavHome.css";

const HeaderHome = () => {
  const navigate = useNavigate();
  const { user, userRole } = useUser();
  const { cartCount } = useCart();
  return (
    <header className="header-home">
      <Link to="/" style={{ textDecoration: "none" }}>
        <h1 className="logo-title">Raffly</h1>
      </Link>

      <nav className="nav-home">
        <ul className="nav-home-ul">
          <li>
            <Link className="nav-home-item" to="/">
              Inicio
            </Link>
          </li>

          <li>
            <Link className="nav-home-item" to="/socios">
              Socios
            </Link>
          </li>

          <li>
            <Link className="nav-home-item" to={"/cart"}>
              <i className="material-icons">local_mall</i>
              <sub>{cartCount}</sub>
            </Link>
          </li>

          <li>
            <Link className="nav-home-item" to="/login">
              <i className="material-icons">account_circle</i>
            </Link>
            {user && (
              <Link className="nav-home-item" to="/success">
                {user.email}
              </Link>
            )}
          </li>

          {user || userRole === "Socio" ? (
            <button
              onClick={() => navigate(`/dashboard/${user?.id}`)}
              style={{
                textDecoration: "none",
                color: "black",
                fontWeight: "600",
                border: "none",
                fontFamily: "Poppins",

                backgroundColor: "orange",
                cursor: "pointer",
                fontSize: "20px",
                padding: "10px",
                borderRadius: "10px",
                marginLeft: "10px",
              }}
            >
              Panel de socios
            </button>
          ) : null}
        </ul>
      </nav>
    </header>
  );
};

export default HeaderHome;

/*
  const HeaderHome = ({ cartCount }) => {
    return (
      <header className="header-home">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 className="logo-title">Raffly</h1>
        </Link>

        <nav className="nav-home">
          <ul className="nav-home-ul">
            <li>
              <Link className="nav-home-item" to="/">
                Inicio
              </Link>
            </li>
            <li>
              <Link className="nav-home-item" to="/create">
                Crear Nueva Rifa
              </Link>
            </li>

            <li>
              <Link className="nav-home-item" to={"/cart"}>
                <i className="material-icons">local_mall</i>
                <sub>{cartCount}</sub>
              </Link>
            </li>

            <li>
              <Link className="nav-home-item" to="/login">
                <i className="material-icons">account_circle</i>
              </Link>
              {user && (
                <Link className="nav-home-item" to="/success">
                  {user.email}
                </Link>
              )}
            </li>

            {userRole === "Admin" || userRole === "Socio" ? (
              <button
                onClick={() => navigate(`/dashboard/${user?.id}`)}
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                  border: "none",
                  backgroundColor: "White",
                  cursor: "pointer",
                  fontSize: "20px",
                  padding: "10px",
                  borderRadius: "10px",
                  marginLeft: "10px",
                }}
              >
                Panel de control
              </button>
            ) : null}
          </ul>
        </nav>
      </header>
    );
  };

  const HeaderContainer = () => {
    const { cartCount } = useCart();
    return <HeaderHome cartCount={cartCount} />;
  };

  */
