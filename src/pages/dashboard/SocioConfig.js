import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../config/supabaseClient";
import "./SocioConfig.css";

const Popup = ({ handleClose, show, children }) => {
  return (
    <div className={`popup ${show ? "show" : ""}`}>
      <div className="popup-inner">
        <p
          style={{ fontSize: "20px", fontFamily: "poppins" }}
          className="close-btn"
          onClick={handleClose}
        >
          <i className="material-icons">close</i>
        </p>
        {children}
      </div>
    </div>
  );
};

const SocioConfig = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const [userMetaData, setUserMetaData] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Track which account is being edited

  const [imagePreview, setImagePreview] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const [phoneNumbers, setPhoneNumbers] = useState([""]);

  const [formData, setFormData] = useState({
    nombre_negocio: "",
    phone: "",
    estado: "",
    color: "",
    facebook_url: "",
    instagram_url: "",
    bancos: [
      {
        img: "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/bbva.png",
        banco: "Bank A",
        clabe: "458 548 856 987 154 158",
        nombre: "Nombre Ejemplo",
      },
      {
        img: "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/logo-bancoppel.png",
        banco: "Bancoppel",
        clabe: "458 548 856 987 154 158",
        nombre: "Nombre Ejempli",
      },
      {
        img: "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/logo-bancoppel.png",
        banco: "Bank C",
        clabe: "458 548 856 987 154 158",
        nombre: "Nombre Ejemplo",
      },
    ],
    image_url:
      "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/Group_61.png",
    phones: ["639 123 4564", "639 123 4564"],
  });

  const [showPopup, setShowPopup] = useState(false);
  const [cambiarNombre, setCambiarNombre] = useState("");
  const [cambiarBanco, setCambiarBanco] = useState("");
  const [cambiarClabe, setCambiarClabe] = useState("");
  const [cambiarImg, setCambiarImg] = useState("asd");
  const [indexUpdate, setIndexUpdate] = useState(null); // `null` indicates a new entry

  console.log(formData);

  useEffect(() => {
    fetchUserData();
  }, [user_id]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from("user_metadata")
        .select()
        .eq("user_id", user_id);
      if (error) {
        throw error;
      }

      console.log("Fetched user data:", data);

      setImagePreview(data[0].image_url);
      setImageURL(data[0].image_url);

      setPhoneNumbers(data[0].phones || [""]);

      setUserMetaData(data);
      setFormData({
        nombre_negocio: data[0].nombre_negocio || "",
        phone: data[0].phone || "",
        estado: data[0].estado || "",
        color: data[0].color || "",
        facebook_url: data[0].facebook_url || "",
        instagram_url: data[0].instagram_url || "",
        bancos: data[0].bancos || [
          {
            img: "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/bbva.png",
            banco: "Bank 89",
            clabe: "888 888 888 888 888 888",
            nombre: "Aun no se configura",
          },
          {
            img: "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/logo-bancoppel.png",
            banco: "Bank 98",
            clabe: "888 888 888 888 888 888",
            nombre: "Aun no se configura",
          },
          {
            img: "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/logo-bancoppel.png",
            banco: "Bank 15",
            clabe: "888 888 888 888 888 888",
            nombre: "Aun no se configura",
          },
        ],
        image_url:
          data[0].image_url ||
          "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/Group_61.png",
        phones: data[0].phones || [],
      });
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangePhones = (index, event) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = event.target.value;
    setPhoneNumbers(newPhoneNumbers);
  };

  const handleAddPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const handleRemovePhoneNumber = (index) => {
    const newPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(newPhoneNumbers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await UpdateSocioData();

    window.location.reload();
  };

  const UpdateSocioData = async () => {
    const telefonos = phoneNumbers;
    try {
      const { data, error } = await supabase
        .from("user_metadata")
        .update({
          nombre_negocio: formData.nombre_negocio,
          color: formData.color,
          phone: formData.phone,
          estado: formData.estado,
          facebook_url: formData.facebook_url,
          instagram_url: formData.instagram_url,
          bancos: formData.bancos,
          image_url: imageURL,
          phones: telefonos,
        })
        .eq("user_id", user_id);

      if (error) {
        throw error;
      }

      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const handleDeleteBanco = (index) => {
    const newBancos = [...formData.bancos];
    newBancos.splice(index, 1);
    setFormData({ ...formData, bancos: newBancos });
  };

  const handleSubmitBancos = () => {
    let newImg = cambiarImg;

    if (cambiarBanco === "BBVA") {
      newImg =
        "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/bbva.png";
    } else if (cambiarBanco === "Banamex") {
      newImg =
        "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/banamex.png";
    } else if (cambiarBanco === "Santander") {
      newImg =
        "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/santander.png";
    } else if (cambiarBanco === "BanBajio") {
      newImg =
        "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/banbajio.jpg";
    } else if (cambiarBanco === "Scotiabank") {
      newImg =
        "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/scotiabank.png";
    } else if (cambiarBanco === "BanCoppel") {
      newImg =
        "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/logo-bancoppel.png";
    } else if (cambiarBanco === "Banco Azteca") {
      newImg =
        "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/banco%20azteca.png";
    } else if (cambiarBanco === "Otro") {
      newImg =
        "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/banco.png";
    } else if (cambiarBanco === "Banorte") {
      newImg =
        "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/bonarte.png";
    } else if (cambiarBanco === "HSBC") {
      newImg =
        "https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/hsbc.png";
    }

    if (indexUpdate === null) {
      // Create new bank entry
      setFormData((prevFormData) => ({
        ...prevFormData,
        bancos: [
          ...prevFormData.bancos,
          {
            banco: cambiarBanco,
            nombre: cambiarNombre,
            clabe: cambiarClabe,
            img: newImg,
          },
        ],
      }));
    } else {
      // Update existing bank entry
      const newBancos = [...formData.bancos];
      newBancos[indexUpdate] = {
        banco: cambiarBanco,
        nombre: cambiarNombre,
        clabe: cambiarClabe,
        img: newImg,
      };
      setFormData({ ...formData, bancos: newBancos });
    }

    setShowPopup(false);
    alert("Recuerda Guardar los cambios para que se vean reflejados");
  };

  const togglePopup = (index) => {
    setShowPopup(!showPopup);
    if (index === undefined) {
      // New entry
      setCambiarBanco("");
      setCambiarClabe("");
      setCambiarNombre("");
      setCambiarImg("");
      setIndexUpdate(null);
    } else {
      // Edit existing entry
      setCambiarBanco(formData.bancos[index].banco);
      setCambiarClabe(formData.bancos[index].clabe);
      setCambiarNombre(formData.bancos[index].nombre);
      setCambiarImg(formData.bancos[index].img);
      setIndexUpdate(index);
    }
    setShowPopup(!showPopup);
  };

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await handleImageUpload(file);
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

  const InputCuentasBanco = ({ bancos }) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          padding: "20px",
        }}
      >
        {bancos.map((banco, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              backgroundColor: "lightgray",
              borderRadius: "15px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <ul style={{ listStyle: "none", minWidth: "200px" }}>
                <li>{banco.banco}</li>
                <li>{banco.nombre}</li>
                <li>{banco.clabe}</li>
              </ul>

              <img
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "fill",

                  objectPosition: "center",

                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "white",
                }}
                src={banco.img}
                alt={banco.banco}
              />

              <i
                onClick={() => togglePopup(index)}
                className="material-icons"
                style={{ cursor: "pointer" }}
              >
                edit
              </i>

              <i
                onClick={() => handleDeleteBanco(index)}
                className="material-icons"
                style={{ cursor: "pointer" }}
              >
                delete
              </i>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Popup show={showPopup} handleClose={togglePopup}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Poppins",
            color: "black",

            padding: "20px",
            borderRadius: "15px",

            margin: "auto",
          }}
        >
          <label htmlFor="banco">Banco</label>
          <select
            onChange={(e) => setCambiarBanco(e.target.value)}
            name="banco"
            value={cambiarBanco}
            style={{
              color: "black",
              padding: "10px",

              borderRadius: "15px",
              border: "1px solid #ccc",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              marginBottom: "20px",
            }}
          >
            <option value="">Selecciona un banco</option>
            <option value="BBVA">BBVA</option>
            <option value="Banamex">Banamex</option>
            <option value="Santander">Santander</option>
            <option value="Scotiabank">Scotiabank</option>
            <option value="HSBC">HSBC</option>
            <option value="Banorte">Banorte</option>
            <option value="BanCoppel">BanCoppel</option>
            <option value="Banco Azteca">Banco Azteca</option>
            <option value="BanBajio">BanBajio</option>

            <option value="Otro">Otro</option>
          </select>

          <label htmlFor="banco">Nombre</label>

          <input
            type="text"
            name="nombre"
            value={cambiarNombre}
            placeholder="Nombre"
            onChange={(e) => {
              setCambiarNombre(e.target.value);
            }}
            style={{
              color: "black",
              padding: "10px",

              borderRadius: "15px",
              border: "1px solid #ccc",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              marginBottom: "20px",
            }}
          />

          <label htmlFor="banco">Clabe</label>

          <input
            type="text"
            name="nombre"
            value={cambiarClabe}
            placeholder="Clabe"
            onChange={(e) => {
              setCambiarClabe(e.target.value);
            }}
            style={{
              color: "black",
              padding: "10px",

              borderRadius: "15px",
              border: "1px solid #ccc",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              marginBottom: "20px",
            }}
          />

          <button
            style={{
              color: "white",
              backgroundColor: "#007BFF",
              padding: "10px",
              borderRadius: "15px",
              border: "none",
              cursor: "pointer",
            }}
            type="button"
            onClick={() => handleSubmitBancos(indexUpdate)}
            disabled={cambiarBanco === ""}
          >
            Actualizar
          </button>
        </form>
      </Popup>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {" "}
        <h2 style={{ padding: "10px", margin: "10px" }}>
          Configuracion de socio
        </h2>
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "15px",
            height: "50px",

            backgroundColor: "black",
            color: "white",
            border: "none",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
          }}
          onClick={async () => {
            await UpdateSocioData();
            window.location.reload();
          }}
          disabled={formData.estado === ""}
        >
          Guardar
        </button>
      </div>

      <div className="form-bancos-container">
        <div className="profile-form-container">
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Poppins",
              color: "black",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              borderRadius: "15px",
              border: "1px solid #ccc",
              maxWidth: "500px",
              margin: "auto",

              backgroundColor: "white",
              gap: "10px",
              maxWidth: "600px",
              width: "90vw",
              height: "80vh",
              overflow: "auto",
            }}
            onSubmit={handleSubmit}
            className="profile-form"
          >
            <div className="image-upload-button">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/*"
              />

              {imagePreview && (
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                    left: "20px",
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleClick}
                    style={{
                      background: "white",
                      border: "none",
                      cursor: "pointer",
                      padding: "10px",
                      borderRadius: "15px",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                      position: "relative",

                      display: "flex",
                      justifyContent: "center",

                      alignItems: "center",

                      width: "50px",

                      height: "50px",

                      left: "-30px",
                      top: "60px",
                    }}
                  >
                    <i
                      className="material-icons"
                      style={{ fontSize: "24px", color: "#333" }}
                    >
                      {" "}
                      add_a_photo
                    </i>
                  </button>
                </div>
              )}
            </div>

            <p
              style={{
                color: "black",
                margin: "10px",
                fontSize: "20px",
                textAlign: "center",
              }}
            >
              {formData.nombre_negocio}
            </p>
            <hr style={{ margin: "10px" }} />

            <div className="form-group">
              <label htmlFor="phone">Telefono Principal (Whatsapp)</label>
              <p>Incluir codigo de area +52 o +1</p>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{
                  color: "black",
                  padding: "10px",
                  margin: "10px",
                  borderRadius: "15px",
                  border: "1px solid #ccc",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>

            <div>
              <label
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                htmlFor="phone"
                onClick={handleAddPhoneNumber}
              >
                Telefonos secundarios(Incluir el principal){" "}
                <i
                  style={{
                    cursor: "pointer",
                    color: "white",
                    backgroundColor: "#6FCF85",
                    padding: "5px",
                    borderRadius: "50%",
                  }}
                  className="material-icons"
                >
                  {" "}
                  add
                </i>
              </label>
              <p>
                Incluir codigo de area +52 o +1 (Estos son los numeros de
                Whatsapp a donde sera redirigido el usuario despues de apartar
                boleto. Inlcuir el principal)
              </p>
              {phoneNumbers.map((phone, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="tel"
                    id={`phone-${index}`}
                    name={`phone-${index}`}
                    value={phone}
                    onChange={(event) => handleChangePhones(index, event)}
                    required
                    style={{
                      color: "black",
                      padding: "10px",
                      margin: "10px",
                      borderRadius: "15px",
                      border: "1px solid #ccc",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoneNumber(index)}
                    style={{
                      marginLeft: "10px",
                      padding: "10px",
                      borderRadius: "15px",
                      border: "1px solid #ccc",
                      backgroundColor: "#DC3545",
                      color: "white",
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado (ubicacion)</label>
              <select
                name="estado"
                id="estado"
                value={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
                }
              >
                <option value="">SELECCIONA ESTADO</option>
                <option value="USA">USA</option>
                <option value="Aguascalientes">Aguascalientes</option>
                <option value="Baja California">Baja California</option>
                <option value="Baja California Sur">Baja California Sur</option>
                <option value="Campeche">Campeche</option>
                <option value="Chiapas">Chiapas</option>
                <option value="Chihuahua">Chihuahua</option>
                <option value="Ciudad de México">Ciudad de México</option>
                <option value="Coahuila">Coahuila</option>
                <option value="Colima">Colima</option>
                <option value="Durango">Durango</option>
                <option value="Estado de México">Estado de México</option>
                <option value="Guanajuato">Guanajuato</option>
                <option value="Guerrero">Guerrero</option>
                <option value="Hidalgo">Hidalgo</option>
                <option value="Jalisco">Jalisco</option>
                <option value="Michoacán">Michoacán</option>
                <option value="Morelos">Morelos</option>
                <option value="Nayarit">Nayarit</option>
                <option value="Nuevo León">Nuevo León</option>
                <option value="Oaxaca">Oaxaca</option>
                <option value="Puebla">Puebla</option>
                <option value="Querétaro">Querétaro</option>
                <option value="Quintana Roo">Quintana Roo</option>
                <option value="San Luis Potosí">San Luis Potosí</option>
                <option value="Sinaloa">Sinaloa</option>
                <option value="Sonora">Sonora</option>
                <option value="Tabasco">Tabasco</option>
                <option value="Tamaulipas">Tamaulipas</option>
                <option value="Tlaxcala">Tlaxcala</option>
                <option value="Veracruz">Veracruz</option>
                <option value="Yucatán">Yucatán</option>
                <option value="Zacatecas">Zacatecas</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="color">Color</label>
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
                style={{
                  color: "black",
                  padding: "10px",
                  margin: "10px",
                  borderRadius: "15px",
                  border: "1px solid #ccc",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="facebook_url">Link de Facebook</label>
              <input
                type="url"
                id="facebook_url"
                name="facebook_url"
                value={formData.facebook_url}
                onChange={handleChange}
                style={{
                  color: "black",
                  padding: "10px",
                  margin: "10px",
                  borderRadius: "15px",
                  border: "1px solid #ccc",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="instagram_url">Link de instagram</label>
              <input
                type="url"
                id="instagram_url"
                name="instagram_url"
                value={formData.instagram_url}
                onChange={handleChange}
                style={{
                  color: "black",
                  padding: "10px",
                  margin: "10px",
                  borderRadius: "15px",
                  border: "1px solid #ccc",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "15px",
                marginTop: "20px",
                backgroundColor: "black",
                color: "white",
                border: "none",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              }}
              type="submit"
              disabled={formData.estado === ""}
            >
              Guardar
            </button>
          </form>
        </div>

        {userMetaData.length > 0 && (
          <div
            style={{
              display: "flex",

              flexDirection: "column",
              alignItems: "center",

              gap: "20px",
              padding: "20px",
            }}
          >
            <button
              style={{
                width: "max-content",
                padding: "10px",
                borderRadius: "15px",

                backgroundColor: "black",
                color: "white",
                border: "none",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
              onClick={() => togglePopup()}
            >
              <i className="material-icons">add</i>
              Añadir cuenta
            </button>
            <div
              style={{
                maxWidth: "500px",
                width: "90vw",

                backgroundColor: "white",
                height: "63vh",

                borderRadius: "20px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",

                overflowY: "auto",
              }}
            >
              {" "}
              <InputCuentasBanco bancos={formData.bancos} />
            </div>
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "15px",
                height: "50px",

                backgroundColor: "black",
                color: "white",
                border: "none",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
              onClick={async () => {
                await UpdateSocioData();
                window.location.reload();
              }}
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SocioConfig;
