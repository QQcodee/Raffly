import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useUser } from "../UserContext";

import HeaderLogin from "./HeaderLogin";

// Import dashboard.css
import "../css/dashboard.css";
import { Today } from "@mui/icons-material";

const Create = () => {
  const [nombre, setNombre] = useState("");
  const [desc, setDesc] = useState("");
  // const [fecharifa,setfecharifa] = useState("")
  const [precioboleto, setprecioboleto] = useState("");
  const [numboletos, setnumboletos] = useState("");
  const [socio, setSocio] = useState("");
  const [formError, setFormError] = useState(null);
  const { user, userRole, userMetaData } = useUser();
  const [categoria, setCategoria] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImageURL] = useState(null);
  const [date, setDate] = useState("");

  const [startDate, setStartDate] = useState("");

  const navigate = useNavigate();

  const navMisRifas = () => {
    navigate("/dashboard/" + user.id + "/mis-rifas");
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    setStartDate(formattedDate);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !nombre ||
      !desc ||
      !precioboleto ||
      !numboletos ||
      !image ||
      !date ||
      !userMetaData ||
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
        socio: userMetaData[0].nombre_negocio,
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

  const [costoTotal, setCostoTotal] = useState(0);
  const stripeFee = 0.036;
  const appFee = 0.015;
  const taxFee = 0.16;

  const totalDays =
    (new Date(date) - new Date(startDate)) / (1000 * 60 * 60 * 24);

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "space-between" }}
        className="page create"
      >
        <div className="create-form">
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

            <label htmlFor="costo-total">Costo total:</label>
            <input
              type="number"
              id="costo-total"
              value={costoTotal}
              onChange={(e) => setCostoTotal(e.target.value)}
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
            {userMetaData[0] ? <p> {userMetaData[0].nombre_negocio}</p> : null}

            <p style={{ color: "red" }}>
              Asegurate de que todos los datos esten bien porque no vas a poder
              editar los datos una vez creada la rifa
            </p>

            <button type="submit">Crear Rifa</button>

            {formError && <p className="error">{formError}</p>}
          </form>
        </div>

        <div style={{ textAlign: "center" }} className="estimaciones">
          <p>Estimaciones</p>
          <p>
            Ingreso estimado de la rifa $
            {(precioboleto * numboletos).toLocaleString("es-MX")}
          </p>

          <p>
            {" "}
            Cantidad de boletos vendidos para recuperar inversion{" "}
            {Math.ceil(costoTotal / precioboleto).toLocaleString("es-MX")}{" "}
          </p>

          <p>Costo de la rifa ${(1 * costoTotal).toLocaleString("es-MX")}</p>

          <p>
            Cantidad necesaria de boletos vendidos por dia{" "}
            {Math.ceil(numboletos / totalDays).toLocaleString("es-MX")}{" "}
          </p>

          <p>
            Comisiones por boleto % por cada boleto vendido: $
            {precioboleto * stripeFee +
              3 +
              (precioboleto * stripeFee + 3) * taxFee +
              precioboleto * appFee}
          </p>

          <p>
            {((precioboleto * stripeFee +
              3 +
              (precioboleto * stripeFee + 3) * taxFee +
              precioboleto * appFee) /
              precioboleto) *
              100}{" "}
            %
          </p>

          <button onClick={navMisRifas}>Volver</button>
        </div>
      </div>
    </div>
  );
};

export default Create;
