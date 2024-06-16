import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const [searchTelefono, setSearchTelefono] = useState(""); // State for searching by telefono

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
    const telefonoMatch = item.telefono
      ? item.telefono.toString().includes(searchTelefono.toString())
      : false;

    return (
      nombreMatch &&
      (searchNumber === "" || numberMatch) &&
      (searchTelefono === "" || telefonoMatch)
    );
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
    <div className="boletos-dashboard">
      <div className="boletos-dashboard-top">
        <h2>Data Table</h2>

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
      </div>
      <div>
        <input
          type="text"
          id="nombreInput"
          value={searchTerm}
          onChange={handleNombreSearch}
          placeholder="Buscar por nombre"
          style={{
            width: "200px",
            color: "black",
            padding: "10px",
            margin: "10px",
            borderRadius: "15px",
            border: "1px solid #ccc",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>
      <div>
        <input
          type="text"
          id="numberInput"
          value={searchNumber}
          onChange={handleNumberSearch}
          placeholder="Buscar por boleto"
          style={{
            width: "200px",
            color: "black",
            padding: "10px",
            margin: "10px",
            borderRadius: "15px",
            border: "1px solid #ccc",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>
      <input
        type="text"
        id="telefonoInput"
        value={searchTelefono}
        onChange={(e) => setSearchTelefono(e.target.value)}
        placeholder="Buscar por telefono"
        style={{
          width: "200px",
          color: "black",
          padding: "10px",
          margin: "10px",
          borderRadius: "15px",
          border: "1px solid #ccc",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      />
      <div>
        <table className="content-table">
          <thead>
            <tr>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("nombre")}
              >
                Nombre Comprador <i className="material-icons">swap_vert</i>
              </th>

              <th>Valor</th>
              <th>Boletos</th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("comprado")}
              >
                Estado <i className="material-icons">swap_vert</i>
              </th>
              <th>Email</th>
              <th>Telefono</th>

              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("id")}
              >
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
                <td>{item.telefono}</td>
                <td>{item.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoletosDashboard;
