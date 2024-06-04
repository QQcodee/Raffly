import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useEffect } from "react";
import { useUser } from "../UserContext";

import HeaderLogin from "./HeaderLogin";
import ByWho from "../components/ByWho";

//import dashboard.css
import "../css/dashboard.css";

const Create = () => {
  const [nombre, setNombre] = useState("");
  const [desc, setDesc] = useState("");
  //const [fecharifa,setfecharifa] = useState("")
  const [precioboleto, setprecioboleto] = useState("");
  const [numboletos, setnumboletos] = useState("");
  const [socio, setSocio] = useState("");
  const [formError, setFormError] = useState(null);
  const { user, userRole } = useUser();
  const [socioMetaData, setSocioMetaData] = useState(null);
  const [categoria, setCategoria] = useState(null);

  const navigate = useNavigate();
  const navHome = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !desc || !precioboleto || !numboletos) {
      setFormError("Please fill in all the fields correctly.");
      return;
    }

    const { data, error } = await supabase.from("rifas").insert([
      {
        nombre,
        desc,
        precioboleto,
        numboletos,
        socio: socioMetaData,
        user_id: user.id,
        categoria: categoria,
      },
    ]);
    navigate("/dashboard/" + user.id + "/my-raffles");

    if (error) {
      console.log(error);
      setFormError("Please fill in all the fields correctly.");
    }
    if (data) {
      console.log(data);
      setFormError(null);
    }
  };

  useEffect(() => {
    const fetchSocio = async () => {
      const { data, error } = await supabase
        .from("user_metadata_view")
        .select()
        .eq("user_id", user.id);

      if (error) {
        console.log(error);
      }
      if (data) {
        setSocioMetaData(data[0].nombre_negocio);
      }
    };

    fetchSocio();
  }, []);

  return (
    <div>
      <div className="page create">
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre">Nombre rifa:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label htmlFor="desc">Descripcion:</label>
          <textarea
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <label htmlFor="numboletos">Numero de Boletos:</label>
          <input
            type="number"
            id="numboletos"
            value={numboletos}
            onChange={(e) => setnumboletos(e.target.value)}
          />

          <label htmlFor="precioboleto">Precio del boleto:</label>
          <input
            type="number"
            id="precioboleto"
            value={precioboleto}
            onChange={(e) => setprecioboleto(e.target.value)}
          />

          <label htmlFor="categoria">Categoría:</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Seleccione una categoría</option>
            <option value="categoria1">Vehiculos</option>
            <option value="categoria2">Celulares</option>
            <option value="categoria3">Efectivo</option>
            <option value="categoria4">Joyeria</option>
            <option value="categoria5">Relojes</option>
            <option value="categoria6">Otro</option>
            {/* Add more options as needed */}
          </select>

          <ByWho user_meta={user.id} />

          <button type="submit">Crear Rifa</button>

          {formError && <p className="error">{formError}</p>}
        </form>

        <button onClick={navHome}>Volver</button>
      </div>
    </div>
  );
};

export default Create;
