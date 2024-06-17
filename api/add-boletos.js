require("dotenv").config();

const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const bodyParser = require("body-parser");

const clientURL = process.env.CLIENT_URL;

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

app.use(cors({ origin: clientURL }));
app.use(express.json());
app.use(bodyParser.json());

app.post("/api/add-boletos", async (req, res) => {
  const {
    userId,
    accountId,
    rifa,
    firstName,
    lastName,
    email,
    phone,
    ticketNumbersArray,
    paymentMethodType,
  } = req.body;

  try {
    const { data, error } = await supabase.from("boletos").insert([
      {
        id_rifa: rifa.id,
        num_boletos: ticketNumbersArray,
        user_id: userId,
        precio: rifa.precioboleto,
        desc: rifa.desc,
        nombre_rifa: rifa.nombre,
        email: email,
        telefono: phone,
        img_rifa: rifa.img,
        socio: rifa.socio,
        nombre: firstName + " " + lastName,
        fecharifa: rifa.fecharifa,
        socio_user_id: rifa.user_id,
        comprado: paymentMethodType === "card" ? true : null,
        oxxo: paymentMethodType === "oxxo" ? true : null,
      },
    ]);

    if (error) {
      throw error;
    }

    res.status(200).send({ success: true, data });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = app;
