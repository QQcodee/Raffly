import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import './css/auth.css'; 
import React, { useEffect, useContext } from 'react';
import supabase from './config/supabaseClient';
import { AuthContext } from './AuthContext';

// pages
import Home from "./pages/Home"
import Create from "./pages/Create"
import CartPage from './pages/CartPage';
import Update from "./pages/Update"
import RenderRifa from "./pages/RenderRifa"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp" // Import SignUp

function App() {

/*   const { setAuth } = useContext(AuthContext);

  useEffect(() => {
    const session = supabase.auth.session();
    setAuth(session ? true : false);

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(session ? true : false);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [setAuth]);
   */
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <nav>
            <h1>Raffly</h1>
            <Link to="/">Home</Link>
            <Link to="/create">Crear Nueva Rifa</Link>
            <Link to="/cart">Shopping Cart</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link> {/* New Link for SignUp */}
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/:id" element={<Update />} />
            <Route path="/render/:id" element={<RenderRifa/>} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} /> {/* New Route for SignUp */}
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
