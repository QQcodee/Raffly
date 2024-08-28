import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

import HeaderGlobal from "../components/HeaderGlobal";
import CarouselRifas from "../components/CarouselRifas";
import RifaList from "../components/RifaList";
import FooterGlobal from "../components/FooterGlobal";
import RifaListMobile from "../components/RifaListMobile";

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
        .eq("status", "True")
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
        .eq("status", "True")
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
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          alignItems: "center",
          fontFamily: "Poppins",
        }}
      >
        <h1>Rifas Activas</h1>

        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "800px",
          }}
        >
          <hr style={{ width: "100%", border: "1px solid #2e2e2e" }} />
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: "Poppins",
            }}
          >
            <button
              style={{
                width: "100%",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: categoria === "todas" ? "#6FCF85" : "#343A40",
              }}
              onClick={() => setCategoria("todas")}
            >
              Todas las categorias
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: "Poppins",
            }}
          >
            <button
              style={{
                width: "100%",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  categoria === "Vehiculos" ? "#6FCF85" : "#343A40",
              }}
              onClick={() => setCategoria("Vehiculos")}
            >
              <i style={{ fontSize: "25px" }} className="material-icons">
                two_wheeler
              </i>{" "}
              Vehiculos
            </button>

            <button
              style={{
                width: "100%",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  categoria === "Efectivo" ? "#6FCF85" : "#343A40",
              }}
              onClick={() => setCategoria("Efectivo")}
            >
              <i style={{ fontSize: "25px" }} className="material-icons">
                payments
              </i>{" "}
              Efectivo
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: "Poppins",
            }}
          >
            <button
              style={{
                width: "100%",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  categoria === "Relojes" ? "#6FCF85" : "#343A40",
              }}
              onClick={() => setCategoria("Relojes")}
            >
              <i style={{ fontSize: "25px" }} className="material-icons">
                watch
              </i>{" "}
            </button>
            <button
              style={{
                width: "100%",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  categoria === "Celulares" ? "#6FCF85" : "#343A40",
              }}
              onClick={() => setCategoria("Celulares")}
            >
              <i style={{ fontSize: "25px" }} className="material-icons">
                phone_iphone
              </i>{" "}
            </button>
            <button
              style={{
                width: "100%",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  categoria === "Joyeria" ? "#6FCF85" : "#343A40",
              }}
              onClick={() => setCategoria("Joyeria")}
            >
              <i style={{ fontSize: "25px" }} className="material-icons">
                diamond
              </i>{" "}
            </button>
            <button
              style={{
                width: "100%",
                display: "flex",

                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  categoria === "Propiedades" ? "#6FCF85" : "#343A40",
              }}
              onClick={() => setCategoria("Propiedades")}
            >
              <i style={{ fontSize: "25px" }} className="material-icons">
                home
              </i>
            </button>
          </div>
          <hr style={{ width: "100%", border: "1px solid #2e2e2e" }} />
        </div>

        {fetchError && <p>{fetchError}</p>}
        {rifas === null ||
          (rifas.length === 0 && <p>No hay rifas activas en esta categoria</p>)}
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

/*



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
      
          </select>

          */
