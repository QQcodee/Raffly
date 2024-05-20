import React from "react";
import { Link } from "react-router-dom"; // Assuming you are using React Router

import supabase from "../config/supabaseClient";
import { useState, useEffect } from "react";

import "../css/index.css";
import "../css/NavHome.css";

const HeaderLogin = () => {
  return (
    <>
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
          </ul>
        </nav>
      </header>
    </>
  );
};

export default HeaderLogin;
