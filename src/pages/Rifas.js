import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

import HeaderGlobal from "../components/HeaderGlobal";
import CarouselRifas from "../components/CarouselRifas";
import RifaList from "../components/RifaList";
import FooterGlobal from "../components/FooterGlobal";

const Rifas = () => {
  const [rifas, setRifas] = useState(null);

  const [fetchError, setFetchError] = useState(null);

  const { user, userRole } = useUser();

  const navigate = useNavigate();

  const [categoria, setCategoria] = useState("todas");

  useEffect(() => {
    const fetchRifas = async () => {
      if (categoria !== "todas") return;

      const { data, error } = await supabase
        .from("rifas")
        .select()
        .order("created_at", { ascending: false })
        .range(0, 20);

      if (error) {
        setFetchError("Could not fetch rifas");
        setRifas(null);
        console.log(error);
      } else {
        setRifas(data);
        setFetchError(null);
      }
    };

    fetchRifas();
  }, [categoria]);

  useEffect(() => {
    const fetchRifas = async () => {
      if (categoria === "todas") return;
      const { data, error } = await supabase
        .from("rifas")
        .select()
        .eq("categoria", categoria)
        .order("created_at", { ascending: false })
        .range(0, 20);

      if (error) {
        setFetchError("Could not fetch rifas");
        setRifas(null);
        console.log(error);
      }
      if (data) {
        setRifas(data);
        setFetchError(null);
      } else {
        setFetchError("No rifas found");
        setRifas(null);
      }
    };

    fetchRifas();
  }, [categoria]);

  return (
    <>
      <HeaderGlobal />
      <div
        style={{ display: "flex", flexDirection: "column", padding: "60px" }}
      >
        <h1>Rifas</h1>

        <select
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
          style={{
            width: "100%",
            color: "black",
            padding: "10px",
            margin: "10px",
            borderRadius: "15px",
            border: "1px solid #ccc",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <option value="todas">Todas las categorias</option>
          <option value="Vehiculos">Vehiculos</option>
          <option value="Celulares">Celulares</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Joyeria">Joyeria</option>
          <option value="Relojes">Relojes</option>
          <option value="Propiedades">Propiedades</option>

          <option value="Otro">Otro</option>
          {/* Add more options as needed */}
        </select>

        {fetchError && <p>{fetchError}</p>}
        {rifas === null ||
          (rifas.length === 0 && <p>No hay rifas en la base de datos</p>)}
      </div>

      {rifas && (
        <div className="rifas-grid-archive">
          {rifas.map((rifa) => (
            <RifaList key={rifa.id} rifa={rifa} />
          ))}
        </div>
      )}

      <div style={{ height: "50vh" }}></div>
      <FooterGlobal />
    </>
  );
};
export default Rifas;
