import { useState } from "react";
import { useEffect } from "react";
import supabase from "../../config/supabaseClient";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SocioConfig = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const [formData, setFormData] = useState({
    nombre_negocio: "",
    phone: "",
    estado: "",
    color: "",
    facebook_url: "",
    instagram_url: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

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

      // Update formData estado with fetched data
      setFormData({
        nombre_negocio: data[0].nombre_negocio || "",
        phone: data[0].phone || "",
        estado: data[0].estado || "",
        color: data[0].color || "",
        facebook_url: data[0].facebook_url || "",
        instagram_url: data[0].instagram_url || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    await UpdateSocioData();
    window.location.reload();
  };

  const UpdateSocioData = async () => {
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
        })
        .eq("user_id", user_id);

      if (error) {
        throw error;
      }

      if (data) {
        setFormData(data[0]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  return (
    <div className="profile-form-container">
      <h2>Configuracion de Socio</h2>
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
          marginBottom: "50px",
          backgroundColor: "white",
          gap: "10px",
        }}
        onSubmit={handleSubmit}
        className="profile-form"
      >
        <div className="form-group">
          <label htmlFor="nombre_negocio">Nombre Negocio</label>
          <input
            type="text"
            id="nombre_negocio"
            name="nombre_negocio"
            value={formData.nombre_negocio}
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
          <label htmlFor="phone">Telefono (whatsapp)</label>
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
        <div className="form-group">
          <label htmlFor="estado">Estado (ubicacion)</label>
          <input
            type="text"
            id="estado"
            name="estado"
            value={formData.estado}
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
          <label htmlFor="instagram_url">Link de instagram</label>
          <input
            type="url"
            id="instagram_url"
            name="instagram_url"
            value={formData.instagram_url}
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
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default SocioConfig;
