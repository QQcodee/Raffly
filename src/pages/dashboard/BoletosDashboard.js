import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Update from "../Update";
import CountdownTimer from "../../components/CountdownTimer";
import LoadingBar from "../../components/LoadingBar";

const BoletosDashboard = () => {
  const [data, setData] = useState([]);
  const [rifas, setRifas] = useState([]);
  const [selectedRifa, setSelectedRifa] = useState(""); // State to hold the selected rifa ID
  const [selectedName, setSelectedName] = useState("");
  const [sortBy, setSortBy] = useState("id"); // Default sorting by ID
  const [sortDirection, setSortDirection] = useState("asc"); // Default sorting direction
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [searchNumber, setSearchNumber] = useState(""); // State for searching number in num_boletos

  const [currentRifa, setCurrentRifa] = useState("");

  const { user_id } = useParams();

  useEffect(() => {
    const fetchRifas = async () => {
      const { data, error } = await supabase
        .from("rifas")
        .select() // Select only the ID of rifas
        .eq("user_id", user_id);

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
        .from("boletos")
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

  // Function to handle sorting
  const handleSort = (field) => {
    if (field === sortBy) {
      // Toggle sorting direction if same column header clicked again
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sorting field and default to ascending
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Function to perform sorting based on current state
  const sortedData = [...data].sort((a, b) => {
    const isNumeric = !isNaN(parseFloat(a[sortBy])) && isFinite(a[sortBy]);
    const aValue = isNumeric ? parseFloat(a[sortBy]) : a[sortBy];
    const bValue = isNumeric ? parseFloat(b[sortBy]) : b[sortBy];

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Function to handle search by nombre
  const handleNombreSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle search by number in num_boletos
  const handleNumberSearch = (e) => {
    setSearchNumber(e.target.value);
  };

  // Filtering data based on search term and number in num_boletos
  const filteredData = sortedData.filter((item) => {
    const nombreMatch = item.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const numberMatch = item.num_boletos.some(
      (num) => num.toString() === searchNumber
    );

    return nombreMatch && (searchNumber === "" || numberMatch);
  });

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
      <h2>Data Table</h2>
      <div>
        <label htmlFor="rifasSelector">Seleccionar Rifa</label>
        <select
          id="rifasSelector"
          onChange={handleRifaChange}
          value={selectedName}
          style={{ width: "200px", color: "black" }}
        >
          {rifas.map((rifa) => (
            <option key={rifa.id} value={rifa.id}>
              {rifa.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="nombreInput">Buscar Nombre:</label>
        <input
          type="text"
          id="nombreInput"
          value={searchTerm}
          onChange={handleNombreSearch}
        />
      </div>
      <div>
        <label htmlFor="numberInput">Buscar Número:</label>
        <input
          type="text"
          id="numberInput"
          value={searchNumber}
          onChange={handleNumberSearch}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("nombre")}>
              Nombre Comprador <i className="material-icons">swap_vert</i>
            </th>

            <th onClick={() => handleSort("precio")}>
              Valor <i className="material-icons">swap_vert</i>
            </th>
            <th onClick={() => handleSort("num_boletos")}>
              Boletos <i className="material-icons">swap_vert</i>
            </th>
            <th onClick={() => handleSort("comprado")}>
              Estado <i className="material-icons">swap_vert</i>
            </th>
            <th onClick={() => handleSort("id")}>
              Email <i className="material-icons">swap_vert</i>
            </th>

            <th onClick={() => handleSort("id")}>
              ID Boleto <i className="material-icons">swap_vert</i>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>

              <td>{"$" + item.precio * item.num_boletos.length}</td>
              <td>{item.num_boletos.join(", ")}</td>
              <td>{item.comprado === true ? "Pagado" : "Apartado"}</td>
              <td>{item.email}</td>
              <td>{item.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoletosDashboard;
