import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { useUser } from "../UserContext";
import { useEffect } from "react";

//components
import ByWho from "./ByWho";
import LoadingBar from "./LoadingBar";

//css
import "../css/RifaList.css";

const RifaList = ({ rifa, boletosVendidos }) => {
  const [soldTickets, setSoldTickets] = useState([]);

  const navigate = useNavigate();
  const handleCLick = () => {
    navigate(
      "/" +
        encodeURIComponent(rifa.socio.replace(/\s+/g, "-")) +
        "/" +
        encodeURIComponent(rifa.nombre.replace(/\s+/g, "-")) +
        "/" +
        rifa.id +
        "/" +
        rifa.user_id
    );
  };

  const descItems = rifa.desc.split("\n");

  useEffect(() => {
    const fetchSoldTickets = async () => {
      if (!rifa.id) return;

      const { data, error } = await supabase
        .from("boletos")
        .select()
        .eq("id_rifa", rifa.id);

      if (error) {
        console.log(error);
      }
      if (data) {
        // Flatten the arrays of ticket numbers into a single array
        const soldTicketsArray = data.reduce((acc, ticket) => {
          return acc.concat(ticket.num_boletos);
        }, []);
        setSoldTickets(soldTicketsArray);
      }
    };
    fetchSoldTickets();
  }, [rifa.id]);

  return (
    <div className="rifa-list" key={rifa.id}>
      <section onClick={handleCLick} className="imagen-rifa">
        <img src={rifa.img} style={{ width: "100%" }} />
      </section>

      <section className="info-rifa">
        <h1 className="rifa-nombre">{rifa.nombre}</h1>
        <hr className="divider" />

        <ul className="rifa-desc">
          {descItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <CountdownTimer fecha={rifa.fecharifa} />
        <p className="rifa-precio">${rifa.precioboleto}</p>
        <LoadingBar boletosVendidos={soldTickets.length} rifa={rifa} />
        <ByWho user_meta={rifa.user_id} />
      </section>
    </div>
  );
};

export default RifaList;
