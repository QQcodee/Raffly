import React from "react";
import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [boletos, setBoletos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("boletos")
        .select(`created_at, num_boletos `)
        .eq("id_rifa", "cc85d357-e75d-45d5-9fa2-9db5abf18343");

      if (error) {
        console.error(error);
      } else {
        setBoletos(data);
      }
    };

    fetchData();
  }, []);

  console.log(boletos);

  const getDayFromDate = (timestamp) => {
    const date = new Date(timestamp);
    // Get day in YYYY-MM-DD format
    return date.toISOString().split("T")[0];
  };

  // Group objects by day
  const groupedByDay = boletos.reduce((acc, obj) => {
    const day = getDayFromDate(obj.created_at);
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(obj);
    return acc;
  }, {});

  // Calculate the sum of lengths for each day
  const sumOfLengthsByDay = Object.keys(groupedByDay).reduce((result, day) => {
    const sumLengths = groupedByDay[day].reduce(
      (sum, obj) => sum + obj.num_boletos.length,
      0
    );
    result[day] = sumLengths;
    return result;
  }, {});

  console.log(sumOfLengthsByDay);

  return (
    <div>
      <h1>Panel de Estadisticas</h1>
      <p>
        Welcome to your dashboard. Here you can manage your account, view
        statistics, and more.
      </p>
    </div>
  );
};

export default Dashboard;
