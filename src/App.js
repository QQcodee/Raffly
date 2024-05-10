// src/App.js
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CartProvider } from './CartContext'; // Import the CartProvider

// pages
import Home from "./pages/Home"
import Create from "./pages/Create"
import CartPage from './pages/CartPage';
import Update from "./pages/Update"
import RenderRifa from "./pages/RenderRifa"

function App() {
  return (
    <CartProvider> {/* Wrap the router in CartProvider */}
      <BrowserRouter>
        <nav>
          <h1>Raffly</h1>
          <Link to="/">Home</Link>
          <Link to="/create">Crear Nueva Rifa</Link>
          <Link to="/cart">Shopping Cart</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/:id" element={<Update />} />
          <Route path="/render/:id" element={<RenderRifa/>} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
