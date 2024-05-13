import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CartProvider, useCart } from './CartContext';
import { AuthProvider } from './AuthContext';
import './css/auth.css'; 
import './css/index.css';
import './css/NavHome.css';
// pages
import Home from "./pages/Home"
import Create from "./pages/Create"
import CartPage from './pages/CartPage';
import Update from "./pages/Update"
import RenderRifa from "./pages/RenderRifa"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp" // Import SignUp

const Header = ({ cartCount }) => {
    return (


<nav className="nav-home" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
  <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
    <div className="logo-title" style={{ display: 'inline-flex', alignItems: 'center' }}>
      {/* Insert the provided SVG code here */}
      <svg id="logo-15" width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24.5 12.75C24.5 18.9632 19.4632 24 13.25 24H2V12.75C2 6.53679 7.03679 1.5 13.25 1.5C19.4632 1.5 24.5 6.53679 24.5 12.75Z" class="ccustom" fill="#17CF97"></path>
        <path d="M24.5 35.25C24.5 29.0368 29.5368 24 35.75 24H47V35.25C47 41.4632 41.9632 46.5 35.75 46.5C29.5368 46.5 24.5 41.4632 24.5 35.25Z" class="ccustom" fill="#17CF97"></path>
        <path d="M2 35.25C2 41.4632 7.03679 46.5 13.25 46.5H24.5V35.25C24.5 29.0368 19.4632 24 13.25 24C7.03679 24 2 29.0368 2 35.25Z" class="ccustom" fill="#17CF97"></path>
        <path d="M47 12.75C47 6.53679 41.9632 1.5 35.75 1.5H24.5V12.75C24.5 18.9632 29.5368 24 35.75 24C41.9632 24 47 18.9632 47 12.75Z" class="ccustom" fill="#17CF97"></path>
      </svg>
      <h1 style={{ margin: 0 }}>Raffly</h1>
    </div>
  </Link>
  <div>
    <ul className="nav-home-ul">
      <li><Link className="nav-home-item" to="/">Home</Link></li>
      <li><Link className="nav-home-item" to="/dashboard">Dashboard</Link></li>
      <li><Link className="nav-home-item" to="/login">Iniciar Sesion</Link></li>
      <li><Link className="nav-home-item" to="/signup">Registrarse</Link> {/* New Link for SignUp */}</li>
      <li>
        <Link to={"/cart"}>
          <i className="material-icons">local_mall</i>
          <sup className="cart-count">{cartCount}</sup>
        </Link> 
      </li>
    </ul>
  </div>
</nav>


    
    );
};

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                  <HeaderContainer />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard/:id" element={<Dashboard />} />  // For editing
                    <Route path="/dashboard" element={<Dashboard />} />  // For creating new
                    <Route path="/:socio/:nombre/:id" element={<RenderRifa />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                  </Routes> 
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

const HeaderContainer = () => {
    const { cartCount } = useCart();
    return <Header cartCount={cartCount} />;
};

export default App;
