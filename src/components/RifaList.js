import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { useUser } from "../UserContext";

//css
import "../css/RifaList.css";
import { useEffect } from "react";
import ByWho from "./ByWho";

const RifaList = ({ rifa, boletosVendidos }) => {
  const navigate = useNavigate();
  const handleCLick = () => {
    navigate(
      "/" +
        encodeURIComponent(rifa.socio.replace(/\s+/g, "-")) +
        "/" +
        encodeURIComponent(rifa.nombre.replace(/\s+/g, "-")) +
        "/" +
        rifa.id
    );
  };

  const LoadingBar = ({ boletosVendidos, rifa }) => {
    const percentage = (boletosVendidos / rifa.numboletos) * 100;

    return (
      <div className="loading-bar-container">
        <div className="loading-bar">
          <div
            className="loading-bar-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p>{Math.round(percentage)}% sold</p>
      </div>
    );
  };

  const descItems = rifa.desc.split("\n");

  return (
    <div className="rifa-list">
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

        <ByWho user_meta={rifa.user_id} />
        <CountdownTimer rifa={rifa} />
        <p className="rifa-precio">${rifa.precioboleto}</p>
        <LoadingBar boletosVendidos={boletosVendidos || []} rifa={rifa} />
      </section>
    </div>
  );
};

export default RifaList;
