import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import RifaList from '../components/RifaList';

const FilterRifasPage = () => {
  const [rifas, setRifas] = useState([]);
  const [filter, setFilter] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');  // Correct state variable name here

  
  useEffect(() => {
    const fetchRifas = async () => {
      const { data, error } = await supabase.from("rifas").select();



      if (error) {
        setFetchError("Could not fetch rifas");
        setRifas(null);
        console.log(error);
      } else {
        setRifas(data);
        setFetchError(null);
      }
    };

    fetchRifas();
  }, []);

  return (
    <div>
      <h1>Filtered Rifas Page</h1>
      <select onChange={handleFilterChange}>
        <option value="All">All Categories</option>
        <option value="Vehiculos">Vehiculos</option>
        <option value="Celulares">Celulares</option>
        <option value="Efectivo">Efectivo</option>
        <option value="Joyeria">Joyeria</option>
        <option value="Relojes">Relojes</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="number"
        value={minPrice}
        onChange={handleMinPriceChange}
        placeholder="Minimum Price"
      />
      <input
        type="number"
        value={maxPrice}
        onChange={handleMaxPriceChange}
        placeholder="Maximum Price"
      />

      <div className="rifas-grid">
        {rifas.map((rifa) => (
          <RifaList key={rifa.id} rifa={rifa} boletosVendidos={450} />
        ))}
      </div>
    </div>
  );
};

export default FilterRifasPage;


/*
useEffect(() => {
    fetchRifas();
  }, [filter, minPrice, maxPrice]);

  const fetchRifas = async () => {
    console.log(`Filter: ${filter}, Min Price: ${minPrice}, Max Price: ${maxPrice}`);

    let query = supabase.from('rifas').select('*');

    if (filter !== 'All') {
      query = query.eq('category', filter);
    }

    if (minPrice !== '') {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice !== '') {
      query = query.lte('price', parseFloat(maxPrice));
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching rifas:', error);
    } else {
      console.log('Fetched Data:', data);
      setRifas(data);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  */