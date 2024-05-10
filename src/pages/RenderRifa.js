import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import { FixedSizeGrid as Grid } from 'react-window';

const RenderRifa = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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

    const numbers = useMemo(() => {
        return Array.from({ length: rifaDetails.numboletos }, (_, index) => index + 1);
    }, [rifaDetails.numboletos]);

    const Cell = ({ columnIndex, rowIndex, style }) => (
        <div style={style}>
            <button className="num-boletos">{rowIndex * columnCount + columnIndex + 1}</button>
        </div>
    );

    const columnCount = 20; // Adjust based on the width of the grid
    const rowCount = Math.ceil(rifaDetails.numboletos / columnCount);

    return (
        <div className="render-rifa">
            <h1>{rifaDetails.nombre}</h1>
            <p>{rifaDetails.desc}</p>
            <p>${rifaDetails.precioboleto}</p>
            <p>{rifaDetails.numboletos} boletos</p>
            <p>{rifaDetails.socio}</p>

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
