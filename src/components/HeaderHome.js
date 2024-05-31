import React from "react";
import { Link } from "react-router-dom"; // Assuming you are using React Router
import { useCart } from "../CartContext";
import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";

import "../css/index.css";
import "../css/NavHome.css";

const HeaderHome = ({ userRole, cartCount, user }) => {
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

            <Link className="nav-home-item" to="/success">
              {user.email}
            </Link>
          </li>

          {userRole === "Admin" ? (
            <>
              <li>
                <Link className="nav-home-item" to="/dashboard">
                  Panel de administrador
                </Link>
              </li>
            </>
          ) : (
            <></>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default HeaderHome;
