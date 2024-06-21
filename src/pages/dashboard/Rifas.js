import React, { useState, useEffect } from 'react';
import supabase from "../../config/supabaseClient";

function FilterPage() {
    const [data, setData] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const { data: retrievedData, error } = await supabase
            .from('rifas')
            .select('*');
        if (error) console.log('Error:', error);
        else setData(retrievedData);
    }

    function handleSearch(event) {
        setQuery(event.target.value);
    }

    const filteredData = data.filter(item => item.columnName.includes(query));

    return (
        <div>
            <input type="text" placeholder="Search..." onChange={handleSearch} />
            <ul>
                {filteredData.map((item, index) => (
                    <li key={index}>{item.columnName}</li>
                ))}
            </ul>
        </div>
    );
}

export default FilterPage;
