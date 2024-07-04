import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../config/supabaseClient";
import { useUser } from "../../UserContext";

// Import dashboard.css
import "./CrearRifa.css";
import Switch from "react-switch";
import UploadImage from "../../components/UploadImage";

const CrearRifa = () => {
  const [nombre, setNombre] = useState("");
  const [desc, setDesc] = useState("");
  // const [fecharifa,setfecharifa] = useState("")
  const [precioboleto, setprecioboleto] = useState("");
  const [numboletos, setnumboletos] = useState("");
  const [formError, setFormError] = useState(null);
  const { user, userRole, userMetaData } = useUser();
  const [categoria, setCategoria] = useState(null);

  const [tarjeta, setTarjeta] = useState(false);
  const [oxxo, setOxxo] = useState(false);
  const [transferencia, setTransferencia] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImageURL] = useState(null);
  const [date, setDate] = useState("");

  const [startDate, setStartDate] = useState("");

  const [imageUrls, setImageUrls] = useState([]);

  const handleImageUrls = (urls) => {
    setImageUrls((prevUrls) => [...prevUrls, ...urls]);
    console.log("Received URLs:", urls);
  };

  const handleSwitchTarjeta = (checked) => {
    setTarjeta({
      ...tarjeta,
      booleanValue: checked,
    });
  };

  const handleSwitchOxxo = (checked) => {
    setOxxo({
      ...oxxo,
      booleanValue: checked,
    });
  };

  const handleSwitchTransferencia = (checked) => {
    setTransferencia({
      ...transferencia,
      booleanValue: checked,
    });
  };

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
      !userMetaData ||
      !categoria ||
      !imageUrls ||
      (oxxo === false && tarjeta === false && transferencia === false)
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
        fecharifa: date ? date : null,
        oxxo: oxxo.booleanValue,
        tarjeta: tarjeta.booleanValue,
        transferencia: transferencia.booleanValue,
        galeria: galeria,
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

  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [socioMetaData, setSocioMetaData] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const [items, setItems] = useState([]);
  const [arrayImagenes, setArrayImagenes] = useState([]);
  //const rifa = "5e087aad-06ad-4ae4-9aaf-477f9fdf9209";

  const [galeria, setGaleria] = useState([]);

  // Function to append new items to the array
  const addItems = (newItems) => {
    setItems((prevItems) => [...prevItems, ...newItems]);
  };

  const handleImagesUpload = async (files) => {
    const newImagePreviews = [];
    const newImageURLs = [];
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const existingImage = items.find((item) => item.includes(file.name));

        if (existingImage) {
          newImagePreviews.push(existingImage);
          newImageURLs.push(existingImage);
        } else {
          const filePath = `public/${file.name}`;
          const { data, error } = await supabase.storage
            .from("imagenes-rifas")
            .upload(filePath, file);
        }

        const filePath = `public/${file.name}`;

        // Retrieve the public URL for the uploaded image
        const { data: publicURLData, error: publicURLError } = supabase.storage
          .from("imagenes-rifas")
          .getPublicUrl(filePath);

        if (publicURLError) {
          throw publicURLError;
        }

        const publicURL = publicURLData.publicUrl;
        newImagePreviews.push(publicURL);
        newImageURLs.push(publicURL);
        setGaleria(newImageURLs);
        console.log(galeria);
      } catch (error) {
        console.error("Error uploading image:", error.message);
      }
    });

    await Promise.all(uploadPromises);
    setImagePreviews((prev) => [...prev, ...newImagePreviews]);
    addItems(newImageURLs);
    setImages((prev) => [...prev, ...newImageURLs]);
  };

  const handleDeleteImagen = (url) => {
    const updatedImages = images.filter((imageUrl) => imageUrl !== url);
    setGaleria(updatedImages);
    setItems(updatedImages);
    setImagePreviews(updatedImages);
    setImages(updatedImages);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "50px",
        }}
      >
        <div>
          <form
            style={{
              maxWidth: "800px",
              fontFamily: "Poppins",
              border: "1px solid #ccc",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
              placeholder="Nombre de la Rifa"
            />

            <textarea
              id="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
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
              placeholder="Descripcion de la Rifa (Premios, etc.)"
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <input
                type="number"
                id="numboletos"
                value={numboletos}
                onChange={(e) => setnumboletos(e.target.value)}
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
                placeholder="Numero de boletos (Entre 100 y 60,000)"
              />

              <input
                type="number"
                id="precioboleto"
                value={precioboleto}
                onChange={(e) => setprecioboleto(e.target.value)}
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
                placeholder="Precio de cada boleto"
              />
            </div>

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
              <option value="">Seleccione una categoría</option>
              <option value="Vehiculos">Vehiculos</option>
              <option value="Celulares">Celulares</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Joyeria">Joyeria</option>
              <option value="Relojes">Relojes</option>
              <option value="Propiedades">Propiedades</option>

              <option value="Otro">Otro</option>
              {/* Add more options as needed */}
            </select>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                padding: "20px",
                margin: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p>Pagos con tarjeta:</p>
                <label>
                  <Switch
                    onChange={handleSwitchTarjeta}
                    checked={tarjeta.booleanValue}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    handleDiameter={30}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={48}
                    className="react-switch"
                    id="material-switch"
                  />
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <label>
                  <p style={{ fontWeight: "400" }}>Pagos con oxxo:</p>

                  <Switch
                    onChange={handleSwitchOxxo}
                    checked={oxxo.booleanValue}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    handleDiameter={30}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={48}
                    className="react-switch"
                    id="material-switch"
                  />
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p>Pagos con transferencia:</p>
                <label>
                  <Switch
                    onChange={handleSwitchTransferencia}
                    checked={transferencia.booleanValue}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    handleDiameter={30}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={48}
                    className="react-switch"
                    id="material-switch"
                  />
                </label>
              </div>
            </div>

            <label
              style={{ margin: "20px", width: "100%", fontWeight: "400" }}
              htmlFor="date"
            >
              Fecha del sorteo:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "25%",
                color: "black",
                padding: "10px",

                margin: "20px",

                borderRadius: "15px",
                border: "1px solid #ccc",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              }}
            />

            <div style={{ padding: "20px", width: "100%" }}>
              <label style={{ fontWeight: "400" }} htmlFor="image">
                Imagen Principal:
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                required
                style={{
                  width: "100%",
                  color: "black",
                  padding: "10px",

                  borderRadius: "15px",
                  border: "1px solid #ccc",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              />

              {/* Display preview of uploaded image */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "100px" }}
                />
              )}
            </div>

            <div style={{ padding: "20px", width: "100%" }}>
              <label style={{ fontWeight: "400" }} htmlFor="image">
                Galeria: (INCLUYE LA IMAGEN PRINCIPAL)
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => handleImagesUpload(e.target.files)}
                required
                multiple
                style={{
                  width: "100%",
                  color: "black",
                  padding: "10px",

                  borderRadius: "15px",
                  border: "1px solid #ccc",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              />

              <div className="image-gallery">
                {items.map((url, index) => (
                  <div
                    style={{ display: "inline-block" }}
                    key={index}
                    className="image-item"
                    url={url}
                  >
                    <img
                      src={url}
                      alt={url}
                      style={{ width: "100px", height: "100px" }}
                    />

                    <button
                      onClick={() => handleDeleteImagen(url)}
                      className="delete-button"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {userMetaData[0] ? (
              <p style={{ fontSize: "20px", margin: "10px" }}>
                Rifa Creada por: {userMetaData[0].nombre_negocio}
              </p>
            ) : null}

            <p style={{ color: "red", margin: "10px" }}>
              Asegurate de que todos los datos esten bien porque no vas a poder
              editar los datos una vendido el primer boleto
            </p>

            <button
              style={{
                margin: "10px",
                width: "100%",
                padding: "10px",
                fontWeight: "400",
                borderRadius: "15px",
                border: "1px solid #ccc",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#007bff",
              }}
              type="submit"
            >
              Crear Rifa
            </button>

            {formError && <p className="error">{formError}</p>}
          </form>
        </div>

        <div style={{ textAlign: "center" }} className="estimaciones">
          <label htmlFor="costo-total">Costo total:</label>
          <input
            type="number"
            id="costo-total"
            value={costoTotal}
            onChange={(e) => setCostoTotal(e.target.value)}
          />

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

export default CrearRifa;
