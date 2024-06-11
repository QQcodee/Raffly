import { useState } from "react";
import supabase from "../config/supabaseClient";
import { useCart } from "../CartContext";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";

const BoletosForm = ({ rifa }) => {
  const { cart } = useCart();

  const navigate = useNavigate();

  const { user } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Extract ticket numbers from cart items
    const ticketNumbersArray = cart.map((item) => item.ticketNumber);

    const { data, error } = await supabase.from("boletos").insert([
      {
        id_rifa: rifa.id,
        num_boletos: ticketNumbersArray,
        user_id: user.id,
        precio: rifa.precioboleto,
        desc: rifa.desc,
        nombre_rifa: rifa.nombre,
        img_rifa: rifa.img,
        socio: rifa.socio,
        nombre: user.user_metadata.name,
        fecharifa: rifa.fecharifa,
      },
    ]);

    if (error) {
      console.error("Error inserting data: ", error);
    } else {
      console.log("Data inserted successfully: ", data);
      navigate(
        "/" +
          encodeURIComponent(rifa.socio.replace(/\s+/g, "-")) +
          "/" +
          encodeURIComponent(rifa.user_id.replace(/\s+/g, "-")) +
          "/mis-boletos"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
};

export default BoletosForm;
