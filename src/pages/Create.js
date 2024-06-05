import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useUser } from "../UserContext";

import HeaderLogin from "./HeaderLogin";
import ByWho from "../components/ByWho";

// Import dashboard.css
import "../css/dashboard.css";

const Create = () => {
  const [nombre, setNombre] = useState("");
  const [desc, setDesc] = useState("");
  // const [fecharifa,setfecharifa] = useState("")
  const [precioboleto, setprecioboleto] = useState("");
  const [numboletos, setnumboletos] = useState("");
  const [socio, setSocio] = useState("");
  const [formError, setFormError] = useState(null);
  const { user, userRole } = useUser();
  const [socioMetaData, setSocioMetaData] = useState(null);
  const [categoria, setCategoria] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImageURL] = useState(null);
  const [date, setDate] = useState("");

  const navigate = useNavigate();
  const navMisRifas = () => {
    navigate("/dashboard/" + user.id + "/mis-rifas");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !nombre ||
      !desc ||
      !precioboleto ||
      !numboletos ||
      !image ||
      !date ||
      !socioMetaData ||
      !categoria
    ) {
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
        img: image,
        fecharifa: date,
      },
    ]);

    if (error) {
      console.log(error);
      setFormError("Please fill in all the fields correctly.");
    } else {
      console.log(data);
      setFormError(null);
      navigate("/dashboard/" + user.id + "/mis-rifas");
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
  }, [user.id]);

  const handleImageUpload = async (file) => {
    try {
      const filePath = `public/${file.name}`;
      const { data, error } = await supabase.storage
        .from("imagenes-rifas")
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Retrieve the public URL for the uploaded image
      const { data: publicURLData, error: publicURLError } = supabase.storage
        .from("imagenes-rifas")
        .getPublicUrl(filePath);

      if (publicURLError) {
        throw publicURLError;
      }

      const publicURL = publicURLData.publicUrl;

      // Set the public URL to the state variable for preview or further processing
      setImagePreview(publicURL);
      setImageURL(publicURL);
    } catch (error) {
      console.error("Error uploading image:", error.message);
    }
  };

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
            <option value="Vehiculos">Vehiculos</option>
            <option value="Celulares">Celulares</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Joyeria">Joyeria</option>
            <option value="Relojes">Relojes</option>
            <option value="Otro">Otro</option>
            {/* Add more options as needed */}
          </select>

          <label htmlFor="image">Imagen:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />

          {/* Display preview of uploaded image */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          )}

          <label htmlFor="date">Fecha del sorteo:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <ByWho user_meta={user.id} />

          <button type="submit">Crear Rifa</button>

          {formError && <p className="error">{formError}</p>}
        </form>

        <button onClick={navMisRifas}>Volver</button>
      </div>
    </div>
  );
};

export default Create;
