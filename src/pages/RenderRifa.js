import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import { FixedSizeGrid as Grid } from 'react-window';
import { useCart } from '../CartContext'; // Import useCart

const RenderRifa = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart(); // Use the addItem function from the cart context
    const [rifaDetails, setRifaDetails] = useState({
        nombre: '',
        desc: '',
        precioboleto: '',
        numboletos: '',
        socio: ''
    });

    useEffect(() => {
        const fetchRifas = async () => {
            const { data, error } = await supabase
                .from('Rifas')
                .select()
                .eq('id', id)
                .single();

            if (error) {
                navigate('/', { replace: true });
            }

            if (data) {
                setRifaDetails({
                    nombre: data.nombre,
                    desc: data.desc,
                    precioboleto: data.precioboleto,
                    numboletos: data.numboletos,
                    socio: data.socio
                });
            }
        };

        fetchRifas();
    }, [id, navigate]);

    const handleAddTicketToCart = (ticketNumber) => {
        addItem({
            raffleId: id,
            ticketNumber,
            price: rifaDetails.precioboleto,
            raffleName: rifaDetails.nombre
        });
    };

    const Cell = ({ columnIndex, rowIndex, style }) => {
        const ticketNumber = rowIndex * columnCount + columnIndex + 1;
        return (
            <div style={style}>
                <button className="num-boletos" onClick={() => handleAddTicketToCart(ticketNumber)}>
                    {ticketNumber}
                </button>
            </div>
        );
    };

    const numbers = useMemo(() => {
        return Array.from({ length: rifaDetails.numboletos }, (_, index) => index + 1);
    }, [rifaDetails.numboletos]);

    const Cell = ({ columnIndex, rowIndex, style }) => (
        <div style={style}>
            <button className="num-boletos">{rowIndex * columnCount + columnIndex + 1}</button>
        </div>
    );

<<<<<<< HEAD
        <h1> Hola</h1>

=======
    const columnCount = 20; // Adjust based on the width of the grid
    const rowCount = Math.ceil(rifaDetails.numboletos / columnCount);
>>>>>>> 32bda5e0cb9e22fe40f8d74ce00cd45fddb9c0e2

    return (
        <div className="render-rifa">
            <h1>{rifaDetails.nombre}</h1>
            <p>{rifaDetails.desc}</p>
            <p>${rifaDetails.precioboleto} per ticket</p>
            <p>{rifaDetails.numboletos} tickets available</p>
            <p>Organized by {rifaDetails.socio}</p>

            <Grid
                className="boletos-grid"
                columnCount={columnCount}
                columnWidth={55} // Adjust the size according to your design
                height={600} // Adjust based on your display area
                rowCount={rowCount}
                rowHeight={50} // Adjust the size according to your design
                width={1100} // Adjust based on the available width
            >
                {Cell}
            </Grid>
        </div>
    );
};

export default RenderRifa;
