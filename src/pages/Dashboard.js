import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";

const Dashboard = () => {
    const { id } = useParams(); // Assuming 'id' is the URL parameter for editing
    const navigate = useNavigate();
    const isNew = !id; // Check if creating new or editing existing

    // State variables
    const [nombre, setNombre] = useState("");
    const [desc, setDesc] = useState("");
    const [precioboleto, setprecioboleto] = useState("");
    const [numboletos, setnumboletos] = useState("");
    const [socio, setSocio] = useState("");
    const [formError, setFormError] = useState(null);

    // Load data if editing
    useEffect(() => {
        if (!isNew) {
            const fetchData = async () => {
                const { data, error } = await supabase
                    .from('Rifas')
                    .select("*")
                    .eq('id', id)
                    .single();
                if (error) console.error("Error fetching data", error);
                else {
                    setNombre(data.nombre);
                    setDesc(data.desc);
                    setprecioboleto(data.precioboleto);
                    setnumboletos(data.numboletos);
                    setSocio(data.socio);
                }
            };
            fetchData();
        }
    }, [id, isNew]);

    // Handle submit for both create and edit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || !desc || !precioboleto || !numboletos || !socio) {
            setFormError('Please fill in all fields correctly.');
            return;
        }

        const payload = { nombre, desc, precioboleto, numboletos, socio };
        const response = isNew
            ? await supabase.from('Rifas').insert([payload])
            : await supabase.from('Rifas').update(payload).eq('id', id);

        if (response.error) {
            console.error(response.error);
            setFormError('Error processing your request.');
        } else {
            setFormError(null);
            navigate('/');
        }
    };

    return (
        <div className="page dashboard">
            <h1>{isNew ? 'Crear Nueva Rifa' : 'Editar Rifa'}</h1>
            <form onSubmit={handleSubmit}>
                {/* Form inputs remain unchanged, refer to your existing Create.js */}
            </form>
            {formError && <p className="error">{formError}</p>}
        </div>
    );
};

export default Dashboard;
