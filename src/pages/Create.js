import { useState } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "../config/supabaseClient"




const Create = () => {
  
    const navigate = useNavigate()

    const [nombre,setNombre] = useState("")
    const [desc,setDesc] = useState("")
    //const [fecharifa,setfecharifa] = useState("")
    const [precioboleto,setprecioboleto] = useState("")
    const [numboletos,setnumboletos] = useState("")
    const [socio,setSocio] = useState("")
    const [formError, setFormError] = useState(null)


    const handleSubmit = async (e) => {
      e.preventDefault()
  
      if (!nombre || !desc || !precioboleto || !numboletos || !socio) {
        setFormError('Please fill in all the fields correctly.')
        return
      }
  
      const { data, error } = await supabase
        .from('Rifas')
        .insert([{ nombre, desc, precioboleto, numboletos, socio }])
  
      if (error) {
        console.log(error)
        setFormError('Please fill in all the fields correctly.')
      }
      if (data) {
        console.log(data)
        setFormError(null)
        navigate('/')
        
        
        

      }
    }
  
    return (
      <div className="page create">
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre">Nombre:</label>
          <input 
            type="text" 
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
  
          <label htmlFor="desc">Descripcion:</label>
          <textarea 
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
  
          <label htmlFor="numboletos">Numero de Boletos:</label>
          <input 
            type="number"
            id="numboletos"
            value={numboletos}
            onChange={(e) => setnumboletos(e.target.value)}
          />
          <label htmlFor="precioboleto">Precio del boleto:</label>
          <input 
            type="number"
            id="precioboleto"
            value={precioboleto}
            onChange={(e) => setprecioboleto(e.target.value)}
          />

          <label htmlFor="socio">Nombre Socio rifador</label>
          <input 
            type="text"
            id="socio"
            value={socio}
            onChange={(e) => setSocio(e.target.value)}
          />
          
  
          <button>Crear Rifa</button>
  
          {formError && <p className="error">{formError}</p>}
        </form>
      </div>
    )
    
  }
  
  
  
export default Create



  