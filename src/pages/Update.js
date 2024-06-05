import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useUser } from "../UserContext";

//import ByWho from "../components/ByWho";

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [desc, setDesc] = useState("");
  //const [fecharifa,setfecharifa] = useState("")
  const [precioboleto, setprecioboleto] = useState("");
  const [numboletos, setnumboletos] = useState("");
  const [socio, setSocio] = useState("");
  const [formError, setFormError] = useState(null);
  const { user, userRole } = useUser();
  //const [socioMetaData, setSocioMetaData] = useState(null);
  const [categoria, setCategoria] = useState(null);

  //const [imagePreview, setImagePreview] = useState(null);
  //const [image, setImageURL] = useState(null);
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !desc || !precioboleto || !numboletos) {
      setFormError("Please fill in all the fields correctly.");
      return;
    }

    const { data, error } = await supabase
      .from("rifas")
      .update({
        nombre,
        desc,
        precioboleto,
        numboletos,
        fecharifa: date,
        categoria,
      })
      .eq("id", id);
    navigate("/dashboard/" + user.id + "/mis-rifas");

    if (error) {
      console.log(error);
      setFormError("Please fill in all the fields correctly.");
    }
    if (data.values) {
      console.log(data);
      setFormError(null);
    }
  };

  useEffect(() => {
    const fetchRifas = async () => {
      const { data, error } = await supabase
        .from("rifas")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        navigate("/", { replace: true });
      }
      if (data) {
        setNombre(data.nombre);
        setDesc(data.desc);
        setnumboletos(data.numboletos);
        setprecioboleto(data.precioboleto);

        setCategoria(data.categoria);
        setDate(data.fecharifa);
        setSocio(data.socio);
      }
    };

    fetchRifas();
  }, [id, navigate]);

  return (
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
          <option value="Vehiculos">Vehiculos</option>
          <option value="Celulares">Celulares</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Joyeria">Joyeria</option>
          <option value="Relojes">Relojes</option>
          <option value="Otro">Otro</option>
          {/* Add more options as needed */}
        </select>

        <label htmlFor="date">Fecha del sorteo:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <p>Socio: {socio}</p>

        <button type="submit">Editar Rifa</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
};

export default Update;
