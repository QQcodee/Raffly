import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import { FixedSizeGrid as Grid } from 'react-window';
import { useCart } from '../CartContext'; // Import useCart

const RenderRifa = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
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

    const columnCount = 10; // Number of tickets per row
    const rowCount = Math.ceil(rifaDetails.numboletos / columnCount); // Total rows needed for the tickets

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
                columnWidth={55}
                height={600}
                rowCount={rowCount}
                rowHeight={50}
                width={1100}
            >
                {Cell}
            </Grid>
        </div>
    );
};

export default RenderRifa;