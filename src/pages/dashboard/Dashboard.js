import React from "react";
import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";
import BoletosDoughnutChart from "../../components/DonutChartMetodosPago";
import { useParams } from "react-router-dom";
import NumbersSoldDoughnutChart from "../../components/DonutChartPorcentaje";

const Dashboard = () => {
  const [boletos, setBoletos] = useState([]);

  const [data, setData] = useState([]);
  const [rifas, setRifas] = useState([]);
  const [selectedRifa, setSelectedRifa] = useState(""); // State to hold the selected rifa ID
  const [selectedName, setSelectedName] = useState("");

  const [currentRifa, setCurrentRifa] = useState("");

  const { user_id } = useParams();

  console.log(data);

  useEffect(() => {
    const fetchRifas = async () => {
      const { data, error } = await supabase
        .from("rifas")
        .select() // Select only the ID of rifas
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      }

      if (data) {
        setRifas(data);
        // Set default selected rifa to the first one in the list
        if (data.length > 0) {
          setSelectedRifa(data[0].id);
          setSelectedName(data[0].nombre);
        }
      }
    };

    fetchRifas();
  }, [user_id]); // Add user_id to dependencies array to fetch rifas when it changes

  useEffect(() => {
    const fetchBoletos = async () => {
      if (!selectedRifa) return; // Exit early if no rifa is selected

      const { data, error } = await supabase
        .from("aggregated_boletos")
        .select()
        .eq("id_rifa", selectedRifa);

      if (error) {
        console.log(error);
      }
      if (data) {
        setData(data);
      }
    };
    fetchBoletos();
  }, [selectedRifa, selectedName]); // Fetch boletos whenever selectedRifa changes

  const handleRifaChange = (e) => {
    const selectedRifaId = e.target.value;
    const selectedRifa = rifas.find((rifa) => rifa.id === selectedRifaId);
    if (selectedRifa) {
      setSelectedRifa(selectedRifa.id);
      setSelectedName(selectedRifa.name);
      setCurrentRifa(selectedRifa);
    }
  };

  return (
    <div>
      <h1>Panel de Estadisticas</h1>
      <p>
        Bienvenido a tu panel de control. Aquí puedes gestionar tu cuenta, ver
        estadísticas y más.
      </p>

      <div className="select-container">
        <select
          id="rifasSelector"
          onChange={handleRifaChange}
          value={selectedName}
          placeholder="Elegir Rifa"
          style={{
            width: "200px",
            color: "black",
            padding: "10px",
            margin: "10px",
            borderRadius: "15px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {rifas.map((rifa) => (
            <option key={rifa.id} value={rifa.id}>
              {rifa.nombre}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ width: "400px" }}>
          <BoletosDoughnutChart boletos={data} />
        </div>

        <div style={{ width: "400px" }}>
          <NumbersSoldDoughnutChart
            boletos={data}
            totalNumbers={currentRifa.numboletos}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
