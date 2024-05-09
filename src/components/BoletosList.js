import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import supabase from "../config/supabaseClient"


const BoletosList = ({number}) => {

    
    
    
    return (

        <div className="boletos-list">
            <button>
                {number}
            </button>

            

    
        </div>
        


    )

}

export default BoletosList