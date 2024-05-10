
import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import supabase from "../config/supabaseClient"
import BoletosList from "../components/BoletosList"



const RenderRifa = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    


    const [nombre,setNombre] = useState("")
    const [desc,setDesc] = useState("")
    //const [fecharifa,setfecharifa] = useState("")
    const [precioboleto,setprecioboleto] = useState("")
    const [numboletos,setnumboletos] = useState("")
    const [socio,setSocio] = useState("")
    //const [formError, setFormError] = useState(null)
    
    
    useEffect(() => {
      const fetchRifas = async () => {
        const { data, error } = await supabase
          .from('Rifas')
          .select()
          .eq('id', id)
          .single()
  
        if (error) {
          navigate('/', { replace: true })
        }
        if (data) {
          setNombre(data.nombre)
          setDesc(data.desc)
          setnumboletos(data.numboletos)
          setprecioboleto(data.precioboleto)
          setSocio(data.socio)
          

        }
      }
  
      fetchRifas()
    }, [id, navigate])

    
    function createArrayWithNumbers({length}) {
      // Create an array with the specified length and fill it with numbers from 1 to length
      return Array.from({ length }, (_, index) => index + 1);
    }

    const length = numboletos
    const numbers = createArrayWithNumbers({length})
    console.log(numbers)


    
    return (

      <div className="render-rifa">

        <h1>{nombre}</h1>
        <p>{desc}</p>
        <p>${precioboleto}</p>
        <p>{numboletos} boletos</p>
        <p>{socio}</p>


        <div className="boletos-grid">
          {numbers.map(number => (
            <button className="num-boletos">{number}</button>
          ))

          }
        </div>

        <h1> Hola</h1>


      


        
             
       
    

      </div>
      
  

    )
 
  }
  
export default RenderRifa


/*
<h1>{nombre}</h1>
<p>{desc}</p>
<p>{precioboleto}</p>
<p>{numboletos} boletos</p>
<p>{socio}</p>
<h2>¿CÓMO SE ELIGE A LOS GANADORES?</h2>
<p>Todos nuestros sorteos se realizan en base a la Lotería Nacional para la Asistencia Pública mexicana.<br></br><br></br><br></br>​El ganador de Rifas La Bola 8 será el participante cuyo número de boleto coincida con las últimas cifras del primer premio ganador de la Lotería Nacional (las fechas serán publicadas en nuestra página oficial).</p>
<h2>¿QUÉ SUCEDE CUANDO EL NÚMERO <br></br> GANADOR ES UN BOLETO NO VENDIDO?</h2>

<p>
  Se elige un nuevo ganador realizando la misma dinámica en otra fecha cercana (se anunciará la nueva fecha).

  Esto significa que, ¡Tendrías el doble de oportunidades de ganar con tu mismo boleto!
</p>

<h2>
  ¿DÓNDE SE PUBLICA A LOS GANADORES?
</h2>

<p>
 En nuestra página oficial de Facebook Rifas La Bola 8 puedes encontrar todos y cada uno de nuestros sorteos anteriores, así como las transmisiones en vivo con Lotería Nacional y las entregas de premios a los ganadores! <br></br> Encuentra transmisión en vivo de los sorteos en nuestra página de Facebook en las fechas indicadas a las 20:00 hrs CDMX. ¡No te lo pierdas!

</p>
*/
