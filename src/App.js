import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./CartContext";

//import { CssBaseline, ThemeProvider } from "@mui/material";
//import { ColorModeContext, useMode } from "./theme";
import "bootstrap/dist/css/bootstrap.min.css";

import "./css/index.css";
import "./css/NavHome.css";
import "./css/dashboard.css";
import "./css/Sidebar.css";

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
import Socios from "./pages/Socios";
import SingleSocio from "./pages/SingleSocio";
import SingleContacto from "./pages/SingleContacto";

// import components
import Onboarding from "./pages/Onboarding";
import MisBoletos from "./pages/MisBoletos";
import BoletoNuevo from "./pages/BoletoNuevo";
import BoletosDashboard from "./pages/dashboard/BoletosDashboard";
import LoginForm from "./components/LoginForm";
import SingleCarrito from "./pages/SingleCarrito";
import LoginSingle from "./pages/LoginSIngle";
import OxxoPaymentStatus from "./components/OxxoPaymentStatus";
import SocioConfig from "./pages/dashboard/SocioConfig";
import FooterGlobal from "./components/FooterGlobal";
import HeaderGlobal from "./components/HeaderGlobal";
import VerificadorBoletos from "./pages/VerificadorBoletos";
import Rifas from "./pages/Rifas";
import CrearRifa from "./pages/dashboard/CrearRifa";
import CalcularOps from "./components/CalcularOps";
import Landing from "./pages/Landing";

//import HeaderLogin from "./pages/HeaderLogin.js";
//import Topbar from "./pages/dashboard/Topbar.js";

//stripe imports

//import cardIcon from "../assets/logooxxo.png";
//import oxxoIcon from "../assets/logooxxo.png";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Main website routes */}
          <Route path="/" element={<Home />} />

          <Route path="/:socio/:nombre/:id/:user_id" element={<RenderRifa />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/landing" element={<Landing />} />

          <Route path="/editar/:id" element={<Update />} />
          <Route path="/crear" element={<Landing />} />

          <Route path="/login" element={<Login />} />
          <Route path="/success" element={<Success />} />

          <Route path="/socios" element={<Socios />} />
          <Route path="/verificador" element={<VerificadorBoletos />} />

          <Route path="/:nombre_negocio/:user_id" element={<SingleSocio />} />

          <Route path="/rifas" element={<Rifas />} />

          <Route
            path="/:nombre_negocio/:user_id/contacto"
            element={<SingleContacto />}
          />
          <Route
            path="/:nombre_negocio/:user_id/mis-boletos"
            element={<MisBoletos />}
          />

          <Route
            path="/:nombre_negocio/:user_id/carrito"
            element={<SingleCarrito />}
          />

          <Route
            path="/:nombre_negocio/:user_id/login"
            element={<LoginSingle />}
          />
          <Route
            path="/:nombre_negocio/:user_id/perfil"
            element={<SingleCarrito />}
          />
          <Route path="/hed" element={<HeaderGlobal />} />

          {/* Dashboard routes */}

          <Route path="/dashboard/:user_id" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="mis-rifas" element={<MisRifas />} />
            <Route path="boletos" element={<BoletosDashboard />} />

            <Route path="crear-rifa" element={<CrearRifa />} />
            <Route path="editar/:id" element={<Update />} />
            <Route path="config" element={<SocioConfig />} />
            <Route path="stripe-config" element={<Onboarding />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
