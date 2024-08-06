import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import supabase from "../../config/supabaseClient";
import { useUser } from "../../UserContext";

// Import dashboard.css
import "./CrearRifa.css";
import Switch from "react-switch";
import UploadImage from "../../components/UploadImage";
import { Alert } from "bootstrap";

const CrearRifa = () => {
  const [nombre, setNombre] = useState(null);
  const [desc, setDesc] = useState(null);

  const { user_id } = useParams();

  // const [fecharifa,setfecharifa] = useState("")
  const [precioboleto, setprecioboleto] = useState(null);
  const [numboletos, setnumboletos] = useState(null);
  const [formError, setFormError] = useState(null);
  const { user, userRole, userMetaData } = useUser(null);

  const [creditos, setcreditos] = useState(null);

  const [categoria, setCategoria] = useState(null);
  const [oportunidades, setOportunidades] = useState(null);

  const [tarjeta, setTarjeta] = useState({ booleanValue: false });
  const [oxxo, setOxxo] = useState({ booleanValue: false });
  const [transferencia, setTransferencia] = useState({ booleanValue: false });

  const [oportunidadesActivas, setOportunidadesActivas] = useState({
    booleanValue: false,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImageURL] = useState(null);
  const [date, setDate] = useState("");

  const [startDate, setStartDate] = useState("");

  const [imageUrls, setImageUrls] = useState([]);

  const [accountExists, setAccountExists] = useState("default");

  const navigate = useNavigate();

  useEffect(() => {
    checkAccountSetup();
  }, [user]);

  useEffect(() => {
    const fetchCreditos = async () => {
      const { data, error } = await supabase
        .from("user_metadata")
        .select("creditos")
        .eq("user_id", user_id);

      if (error) {
        console.log(error);
      }

      if (data) {
        setcreditos(data[0].creditos);
      }
    };

    fetchCreditos();
  }, []);

  useEffect(() => {
    if (creditos === null) {
      return;
    }

    if (creditos < 1) {
      navigate("/dashboard/" + user.id + "/mis-rifas");
    }
  }, [creditos]);

  const handleImageUrls = (urls) => {
    setImageUrls((prevUrls) => [...prevUrls, ...urls]);
    console.log("Received URLs:", urls);
  };

  const handleSwitchTarjeta = (checkedTarjeta) => {
    setTarjeta({
      ...tarjeta,
      booleanValue: checkedTarjeta,
    });
  };

  const handleSwitchOportunidades = (checkedOps) => {
    setOportunidadesActivas({
      ...oportunidadesActivas,
      booleanValue: checkedOps,
    });
  };

  const handleSwitchOxxo = (checkedOxxo) => {
    setOxxo({
      ...oxxo,
      booleanValue: checkedOxxo,
    });
  };

  const handleSwitchTransferencia = (checkeTransferencia) => {
    setTransferencia({
      ...transferencia,
      booleanValue: checkeTransferencia,
    });
  };

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

    if (creditos === null || creditos < 1) {
      return;
    }

    const creditoRestantes = creditos - 1;
    setcreditos(creditoRestantes);

    if (
      !nombre ||
      !desc ||
      !precioboleto ||
      !numboletos ||
      !image ||
      !userMetaData ||
      !categoria ||
      !imageUrls ||
      !oportunidades
    ) {
      setFormError("Llena todos los campos");
      return;
    }

    if (
      oxxo.booleanValue === false &&
      tarjeta.booleanValue === false &&
      transferencia.booleanValue === false
    ) {
      setFormError("Por favor, selecciona al menos una modalidad de pago");
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
        oportunidades:
          oportunidadesActivas.booleanValue === true ? oportunidades : 1,
      },
    ]);

    if (error) {
      console.log(error);
      setFormError("Please fill in all the fields correctly.");
    } else {
      console.log(data);
      setFormError(null);
    }

    restarCreditos(creditoRestantes);
  };

  const restarCreditos = async (creditoRestantes) => {
    const { data, error } = await supabase
      .from("user_metadata")
      .update({ creditos: creditoRestantes })
      .eq("user_id", user.id);

    if (error) {
      console.log(error);
    } else {
      console.log(data);
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
  const appFee = 0.01;
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

  const checkAccountSetup = async () => {
    try {
      const response = await fetch(
        "https://www.raffly.com.mx/api/check-account-exists",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountId: userMetaData[0].stripe_id }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.exists) {
          console.log(
            "Account exists!",
            "Payments active:",
            data.paymentsActive
          );
          if (data.paymentsActive === true) {
            setAccountExists("true");
          }
        } else {
          console.log("Account does not exist.");
        }
      } else {
        console.error("Error checking account existence:", data.error);
      }
    } catch (error) {
      console.error("Error checking account existence:", error);
    }
  };

  useEffect(() => {
    const oportunidadesSet = () => {
      if (numboletos === "100") {
        setOportunidades(1);
      }
      if (numboletos === "500") {
        setOportunidades(2);
      }
      if (numboletos === "1000") {
        setOportunidades(10);
      }
      if (numboletos === "2000") {
        setOportunidades(5);
      }
      if (numboletos === "5000") {
        setOportunidades(2);
      }
      if (numboletos === "7500") {
        setOportunidades(8);
      }
      if (numboletos === "10000") {
        setOportunidades(6);
      }
    };

    oportunidadesSet();
  }, [numboletos]);

  return (
    <>
      {userRole === "Admin" || userRole === "Socio" ? (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "20px",
              gap: "60px",
            }}
          >
            <div>
              <h1>Crear Rifa</h1>

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
                <label
                  style={{ margin: "20px", width: "100%" }}
                  htmlFor="nombre"
                >
                  Nombre de la Rifa:
                </label>
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
                <label style={{ margin: "20px", width: "100%" }} htmlFor="desc">
                  Descripcion:
                </label>

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

                <label
                  style={{
                    margin: "20px",
                    width: "100%",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                  htmlFor="numboletos"
                >
                  Numero de Boletos:
                  <Switch
                    onChange={handleSwitchOportunidades}
                    checked={oportunidadesActivas.booleanValue}
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
                    id="material-switch-ops"
                  />
                  {oportunidadesActivas.booleanValue
                    ? "Oportunidades Activadas"
                    : "Oportunidades Desactivadas"}
                </label>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <select
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
                  >
                    <option value="">Elige cantidad de boletos a emitir</option>
                    <option value="100">100 (1 oportunidad)</option>
                    <option value="500">500 (2 oportunidades)</option>
                    <option value="1000">1000 (10 oportunidades)</option>
                    <option value="2000">2000 (5 oportunidades)</option>
                    <option value="5000">5000 (2 oportunidades)</option>
                    <option value="7500">7500 (8 oportunidades)</option>
                    <option value="10000">10,000 (6 oportunidades)</option>
                    <option value="20000">20,000 (3 oportunidades)</option>
                    <option value="30000">30,000 (2 oportunidades)</option>
                    <option value="60000">60,000 (1 oportunidad)</option>

                    {/* Add more options as needed */}
                  </select>

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

                <label
                  style={{ margin: "20px", width: "100%" }}
                  htmlFor="categoria"
                >
                  Categoría:
                </label>

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

                <label
                  style={{ margin: "20px", width: "100%" }}
                  htmlFor="metodosPago"
                >
                  Metodos de pago:
                </label>

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
                    {accountExists === "default" ? (
                      <p>...</p>
                    ) : accountExists === "true" ? (
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
                          id="material-switch-tarjeta"
                        />
                      </label>
                    ) : (
                      <p>
                        Para aceptar pagos con tarjeta debes configurar stripe
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <p style={{ fontWeight: "400" }}>Pagos con oxxo:</p>

                    {accountExists === "default" ? (
                      <p>...</p>
                    ) : accountExists === "true" ? (
                      <label>
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
                          id="material-switch-oxxo"
                        />
                      </label>
                    ) : (
                      <p>Para aceptar pagos con oxxo debes configurar stripe</p>
                    )}
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
                        id="material-switch-transferencia"
                      />
                    </label>
                  </div>
                </div>

                <label style={{ margin: "20px", width: "100%" }} htmlFor="date">
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
                  <label style={{ width: "100%" }} htmlFor="image">
                    Imagen Principal: (Solo Formato: .jpg, .jpeg, .png)
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
                  <label style={{ width: "100%" }} htmlFor="image">
                    Galeria: (INCLUYE LA IMAGEN PRINCIPAL) (Solo Formato: .jpg,
                    .jpeg, .png)
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
                  <p
                    style={{
                      fontSize: "20px",
                      margin: "10px",
                      fontWeight: "600",
                    }}
                  >
                    Rifa Creada por: {userMetaData[0].nombre_negocio}
                  </p>
                ) : null}

                <p style={{ color: "red", margin: "10px" }}>
                  Asegurate de que todos los datos esten bien porque no vas a
                  poder editar los datos una vendido el primer boleto
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

            {precioboleto && (
              <div
                style={{
                  maxWidth: "800px",
                  fontFamily: "Poppins",
                  border: "1px solid #ccc",
                  borderRadius: "15px",
                  padding: "20px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "white",
                }}
              >
                <div
                  style={{ textAlign: "center", width: "600px" }}
                  className="estimaciones"
                >
                  <h2 style={{ marginBottom: "40px" }}>Estimaciones</h2>

                  <label htmlFor="costo-total">
                    Valor total de los premios:
                  </label>
                  <input
                    type="number"
                    id="costo-total"
                    value={costoTotal}
                    onChange={(e) => setCostoTotal(e.target.value)}
                    style={{
                      color: "black",
                      padding: "10px",
                      margin: "10px",
                      borderRadius: "15px",
                      border: "1px solid #ccc",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      marginTop: "50px",
                    }}
                  >
                    Valor de los premios
                    <p>${(1 * costoTotal).toLocaleString("es-MX")}</p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      borderTop: "1px solid #ccc",
                    }}
                  >
                    Precio Boleto
                    <p>${precioboleto.toLocaleString("es-MX")}</p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      borderTop: "1px solid #ccc",
                    }}
                  >
                    Ingreso estimado de la rifa
                    <p>
                      ${(precioboleto * numboletos).toLocaleString("es-MX")}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      borderTop: "1px solid #ccc",
                    }}
                  >
                    Ganancia estimada
                    {precioboleto * numboletos - costoTotal >= 0 ? (
                      <p
                        style={{
                          color: "green",
                          fontWeight: "500",
                          fontFamily: "Poppins",
                        }}
                      >
                        $
                        {(
                          precioboleto * numboletos -
                          costoTotal
                        ).toLocaleString("es-MX")}
                      </p>
                    ) : (
                      <p
                        style={{
                          color: "red",
                          fontWeight: "500",
                          fontFamily: "Poppins",
                        }}
                      >
                        $
                        {(
                          precioboleto * numboletos -
                          costoTotal
                        ).toLocaleString("es-MX")}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      borderTop: "1px solid #ccc",
                    }}
                  >
                    <p style={{ maxWidth: "40ch", textAlign: "left" }}>
                      {" "}
                      Boletos para recuperar inversion
                    </p>
                    {costoTotal && precioboleto ? (
                      <p>
                        {Math.ceil(costoTotal / precioboleto).toLocaleString(
                          "es-MX"
                        )}
                      </p>
                    ) : null}
                  </div>

                  {date && (
                    <p>
                      Cantidad necesaria de boletos vendidos por dia{" "}
                      {Math.ceil(numboletos / totalDays).toLocaleString(
                        "es-MX"
                      )}{" "}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      borderTop: "1px solid #ccc",
                    }}
                  >
                    <p
                      style={{
                        maxWidth: "40ch",
                        textAlign: "left",
                        color: "red",
                      }}
                    >
                      Comisiones por boleto vendido (tarjeta o oxxo):
                    </p>
                    <p style={{ color: "red" }}>
                      {" "}
                      $
                      {(
                        precioboleto * stripeFee +
                        3 +
                        (precioboleto * stripeFee + 3) * taxFee +
                        precioboleto * appFee
                      ).toFixed(2)}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      borderTop: "1px solid #ccc",
                    }}
                  >
                    <p
                      style={{
                        maxWidth: "40ch",
                        textAlign: "left",
                        color: "red",
                      }}
                    >
                      Maximo de comisiones por rifa:
                    </p>
                    <p style={{ color: "red" }}>
                      {" "}
                      $
                      {(
                        (precioboleto * stripeFee +
                          3 +
                          (precioboleto * stripeFee + 3) * taxFee +
                          precioboleto * appFee) *
                        numboletos
                      ).toLocaleString("es-MX")}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      borderTop: "1px solid #ccc",
                    }}
                  >
                    Comision en %
                    {precioboleto ? (
                      <p>
                        {(
                          ((precioboleto * stripeFee +
                            3 +
                            (precioboleto * stripeFee + 3) * taxFee +
                            precioboleto * appFee) /
                            precioboleto) *
                          100
                        ).toFixed(2)}{" "}
                        %
                      </p>
                    ) : null}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      borderTop: "1px solid #ccc",
                    }}
                  >
                    Ganancia Estimada despues de comisiones
                    {precioboleto * numboletos -
                      costoTotal -
                      (precioboleto * stripeFee +
                        3 +
                        (precioboleto * stripeFee + 3) * taxFee +
                        precioboleto * appFee) *
                        numboletos >=
                    0 ? (
                      <p
                        style={{
                          color: "#6FCF85",
                          fontSize: "20px",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        $
                        {(
                          precioboleto * numboletos -
                          costoTotal -
                          (precioboleto * stripeFee +
                            3 +
                            (precioboleto * stripeFee + 3) * taxFee +
                            precioboleto * appFee) *
                            numboletos
                        ).toLocaleString("es-MX")}
                      </p>
                    ) : (
                      <p style={{ color: "red" }}>
                        {" "}
                        $
                        {(
                          precioboleto * numboletos -
                          costoTotal -
                          (precioboleto * stripeFee +
                            3 +
                            (precioboleto * stripeFee + 3) * taxFee +
                            precioboleto * appFee) *
                            numboletos
                        ).toLocaleString("es-MX")}
                      </p>
                    )}
                  </div>

                  <button onClick={navMisRifas}>Volver</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <h1>No estas autorizado</h1>
      )}
    </>
  );
};

export default CrearRifa;
