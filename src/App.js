import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import './auth.css'; 

// pages
import Home from "./pages/Home"
import Create from "./pages/Create"
import CartPage from './pages/CartPage';
import Update from "./pages/Update"
import RenderRifa from "./pages/RenderRifa"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp" // Import SignUp

function App() {
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
