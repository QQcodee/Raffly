import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CartProvider, useCart } from "./CartContext";
//import { CssBaseline, ThemeProvider } from "@mui/material";
//import { ColorModeContext, useMode } from "./theme";
import "bootstrap/dist/css/bootstrap.min.css";

import "./css/index.css";
import "./css/NavHome.css";
import "./css/dashboard.css";
// pages
import Home from "./pages/Home";
import Create from "./pages/Create";
import CartPage from "./pages/CartPage";
import Update from "./pages/Update";
import RenderRifa from "./pages/RenderRifa";
import Login from "./pages/Login";
import Success from "./pages/Success";
import Dashboard from "./pages/dashboard/Dashboard";
//import HeaderLogin from "./pages/HeaderLogin.js";
//import Topbar from "./pages/dashboard/Topbar.js";

/*
const Header = ({ cartCount }) => {
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
              <sub></sub>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

<HeaderContainer textDecoration="none" />
*/
function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit/:id" element={<Update />} />
          <Route path="/:socio/:nombre/:id" element={<RenderRifa />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/:user_id" element={<Dashboard />} />

          <Route path="/success" element={<Success />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
/*
const HeaderContainer = () => {
  const { cartCount } = useCart();
  return <Header cartCount={cartCount} />;
};
*/

export default App;
