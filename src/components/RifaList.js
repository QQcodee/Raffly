import { Link } from "react-router-dom"
import supabase from "../config/supabaseClient"

const RifaList = ({rifa, onDelete}) => {

    const handleDelete = async () => {
        const { data, error } = await supabase
          .from('Rifas')
          .delete()
          .eq('id', rifa.id)
        
        if (error) {
          console.log(error)
        }
        if (data) {
          console.log(data)
          onDelete(rifa.id)
        }
      }
    

    return (
        
        <div className="rifa-list">
            <h3>{rifa.nombre}</h3>
            <p>{rifa.desc}</p>
            
            <p>${rifa.precioboleto}</p>

            <div className="boletos">{rifa.numboletos} boletos</div>
            <div className="buttons" align="right">
                <Link to={"/render/" + rifa.id}>
                    <i className="material-icons">search</i>
                </Link>
                <Link to={"/" + rifa.id}>
                    <i className="material-icons">edit</i>
                </Link>
                  <i className="material-icons" onClick={handleDelete}>delete</i>
            </div>


        </div>    
    )
    
}

export default RifaList