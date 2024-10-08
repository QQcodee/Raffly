import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { CartProvider } from "./CartContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import ReactGA from "react-ga4";

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
import RifaSingle from "./pages/RifaSingle";
import LoginCart from "./pages/LoginCart";
import SlotMachine from "./components/SlotMachine";
import LimpiarCarrito from "./pages/ClearCart";
import MetodosPago from "./pages/MetodosPago";
import AvisoDePrivacidad from "./pages/AvisoDePrivacidad";
import AdminPanel from "./pages/dashboard/AdminPanel";
import UploadImgV2 from "./components/UploadImgV2";
import Precios from "./pages/Precios";
import RifaListMobile from "./components/RifaListMobile";
import Registro from "./pages/Registro";

//import HeaderLogin from "./pages/HeaderLogin.js";
//import Topbar from "./pages/dashboard/Topbar.js";

//stripe imports

//import cardIcon from "../assets/logooxxo.png";
//import oxxoIcon from "../assets/logooxxo.png";

const TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;
ReactGA.initialize(TRACKING_ID);

function TrackPageViews() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
}

function App() {
  return (
    <CartProvider>
      <Router>
        <TrackPageViews />
        <Routes>
          {/* Main website routes */}
          <Route path="/" element={<Home />} />

          <Route path="/clearcart" element={<LimpiarCarrito />} />

          <Route path="/:socio/:nombre/:id/:user_id" element={<RifaSingle />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/landing" element={<Landing />} />
          <Route path="/aviso-de-privacidad" element={<AvisoDePrivacidad />} />

          <Route path="/editar/:id" element={<Update />} />
          <Route path="/crear" element={<Landing />} />

          <Route path="/login" element={<Login />} />
          <Route path="/success" element={<Success />} />

          <Route path="/socios" element={<Socios />} />

          <Route path="/verificador" element={<VerificadorBoletos />} />
          <Route path="/verificador/:email" element={<VerificadorBoletos />} />

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
            path="/:nombre_negocio/:user_id/mis-boletos/:email"
            element={<MisBoletos />}
          />

          <Route
            path="/:nombre_negocio/:user_id/metodos-de-pago"
            element={<MetodosPago />}
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
            path="/:nombre_negocio/:user_id/login-carrito"
            element={<LoginCart />}
          />
          <Route
            path="/:nombre_negocio/:user_id/perfil"
            element={<SingleCarrito />}
          />

          {/* Dashboard routes */}

          <Route path="/dashboard/:user_id" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="mis-rifas" element={<MisRifas />} />
            <Route path="boletos" element={<BoletosDashboard />} />

            <Route path="crear-rifa" element={<CrearRifa />} />
            <Route path="editar/:id" element={<Update />} />
            <Route path="config" element={<SocioConfig />} />
            <Route path="stripe-config" element={<Onboarding />} />
            <Route path="admin-panel" element={<AdminPanel />} />
          </Route>
        </Routes>
      </Router>
      <Analytics />
      <SpeedInsights />
    </CartProvider>
  );
}

export default App;
