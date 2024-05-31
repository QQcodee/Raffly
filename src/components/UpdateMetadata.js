import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const [nombreNegocio, setNombreNegocio] = useState("");
const [phone, setPhone] = useState("");
const [imageUrl, setImageUrl] = useState("");
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user) {
    setError("No user is signed in");
    return;
  }

  const { data, error } = await supabase.from("user_metadata").upsert(
    {
      user_id: user.id,
      nombre_negocio: nombreNegocio,
      phone,
      image_url: imageUrl,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    setError(error.message);
  } else {
    setSuccess("User metadata created/updated successfully");
    setNombreNegocio("");
    setPhone("");
    setImageUrl("");
  }
};

<div>
  <h2>Update User Metadata</h2>
  <form onSubmit={handleSubmit}>
    <div>
      <label>Nombre Negocio:</label>
      <input
        type="text"
        value={nombreNegocio}
        onChange={(e) => setNombreNegocio(e.target.value)}
      />
    </div>
    <div>
      <label>Phone:</label>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
    </div>
    <div>
      <label>Image URL:</label>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
    </div>
    <button type="submit">Update</button>
  </form>
  {error && <p style={{ color: "red" }}>{error}</p>}
  {success && <p style={{ color: "green" }}>{success}</p>}
</div>;
