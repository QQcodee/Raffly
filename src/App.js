import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

// pages
import Home from "./pages/Home"
import Create from "./pages/Create"
import Update from "./pages/Update"
import RenderRifa from "./pages/RenderRifa"


function App() {
  return (
    <BrowserRouter>
      <nav>
        <h1>Raffly</h1>
        <Link to="/">Home</Link>
        <Link to="/create">Crear Nueva Rifa</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/:id" element={<Update />} />
        <Route path="/render/:id" element={<RenderRifa/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
