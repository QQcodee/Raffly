import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import MisRifas from "./pages/dashboard/MisRifas";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
//import HeaderLogin from "./pages/HeaderLogin.js";
//import Topbar from "./pages/dashboard/Topbar.js";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Main website routes */}
          <Route path="/" element={<Home />} />

          <Route path="/:socio/:nombre/:id" element={<RenderRifa />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/editar/:id" element={<Update />} />
          <Route path="/login" element={<Login />} />
          <Route path="/success" element={<Success />} />

          {/* Dashboard routes */}
          <Route path="/dashboard/:user_id" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="my-raffles" element={<MisRifas />} />
            <Route path="crear-rifa" element={<Create />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
