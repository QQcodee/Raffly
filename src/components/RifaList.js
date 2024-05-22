import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

const RifaList = ({ rifa, onDelete, role }) => {
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

  return (
    <div onClick={handleCLick} className="rifa-list">
      <section className="imagen-rifa">
        <img height={200} width={250} src={rifa.img} />
      </section>

      <section className="info-rifa">
        <h3>{rifa.nombre}</h3>
        <p>{rifa.desc}</p>

        <p>${rifa.precioboleto}</p>
        <p>by {rifa.socio}</p>
        <p></p>

        <p className="boletos">{rifa.numboletos} boletos</p>
        <div className="buttons" align="right">
          {role === "Admin" ? (
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
