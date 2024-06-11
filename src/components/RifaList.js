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
        <LoadingBar boletosVendidos={boletosVendidos || []} rifa={rifa} />
        <ByWho user_meta={rifa.user_id} />
      </section>
    </div>
  );
};

export default RifaList;
