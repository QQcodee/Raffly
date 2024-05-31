import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CountdownTimer from "./CountdownTimer";

//css
import "../css/RifaList.css";
import { useEffect } from "react";
import ByWho from "./ByWho";

const RifaList = ({ rifa, onDelete, role, user_id, userMetaData }) => {
  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("rifas")
      .delete()
      .eq("id", rifa.id);

    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
      onDelete(rifa.id);
    }
  };

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

        <div className="buttons" align="right">
          {role === "Admin" || user_id === rifa.user_id ? (
            <>
              <Link to={"/edit/" + rifa.id}>
                <i className="material-icons">edit</i>
              </Link>
              <i className="material-icons" onClick={handleDelete}>
                delete
              </i>
            </>
          ) : (
            <></>
          )}
        </div>
      </section>
    </div>
  );
};

export default RifaList;

/*

const rifa_user_id = rifas.user_id;
  const [userMetaData, setUserMetaData] = useState(null);
  useEffect(() => {
    const fetchUserMetaData = async () => {
      const { data, error } = await supabase
        .from("user_metadata_view")
        .select()
        .eq("user_id", rifa_user_id);
      if (error) {
        console.log(error);
      }
      if (data) {
        setUserMetaData(data);
      }
    };
    fetchUserMetaData();
  }, []);

  console.log(userMetaData);

  */
