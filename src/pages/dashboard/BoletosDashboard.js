import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CountdownTimer from "../../components/CountdownTimer";
import LoadingBar from "../../components/LoadingBar";
import axios from "axios";
import Papa from "papaparse";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useNavigate } from "react-router-dom";

const CustomAlertDialog = ({ open, handleClose, handleConfirm, boleto }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        style={{ fontWeight: "bold", color: "black", textAlign: "center" }}
        id="alert-dialog-title"
      >
        {"Confirmar pago"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <p
            style={{
              fontWeight: "400",
              fontSize: "20px",
              color: "black",
              textAlign: "center",
            }}
          >
            Seguro que quieres marcar este boleto como pagado?
          </p>
          <br />
          Nombre: <strong>{boleto.nombre}</strong> <br />
          <br /> Números:{" "}
          <strong>
            {boleto.num_boletos ? boleto.num_boletos.join(", ") : "N/A"}
          </strong>{" "}
          <br /> <br /> Oportunidades:{" "}
          <strong>
            {boleto.oportunidades ? boleto.oportunidades.join(", ") : "N/A"}
          </strong>
          <br /> <br /> Valor:{" "}
          <strong>
            {boleto.num_boletos
              ? boleto.num_boletos.length * boleto.precio + " MXN"
              : "N/A"}
          </strong>
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <Button
          style={{ color: "white", backgroundColor: "#DC3545" }}
          onClick={handleClose}
          color="primary"
        >
          Cancelar
        </Button>
        <Button
          style={{ color: "white", backgroundColor: "#28A745" }}
          onClick={handleConfirm}
          color="primary"
          autoFocus
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const BoletosDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [rifas, setRifas] = useState([]);
  const [selectedRifa, setSelectedRifa] = useState(""); // State to hold the selected rifa ID
  const [selectedName, setSelectedName] = useState("");
  const [sortBy, setSortBy] = useState("id"); // Default sorting by ID
  const [sortDirection, setSortDirection] = useState("asc"); // Default sorting direction
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [searchNumber, setSearchNumber] = useState(""); // State for searching number in num_boletos
  const [searchOportunidades, setSearchOportunidades] = useState(""); // State for searching by oportunidades
  const [searchTelefono, setSearchTelefono] = useState(""); // State for searching by telefono
  const [selectedEstado, setSelectedEstado] = useState(""); // State for selected estado

  const [duplicados, setDuplicados] = useState([]);

  const [currentRifa, setCurrentRifa] = useState("");

  const { user_id } = useParams();

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [openEliminar, setOpenEliminar] = useState(false);
  const [boletoItem, setBoletoItem] = useState({});

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    actualizarStatus(boletoItem);
  };

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

  const actualizarStatus = async (boleto) => {
    const { data, error } = await supabase
      .from("boletos")
      .update({ comprado: true, apartado: false })
      .eq("id", boleto.id);

    if (error) {
      console.error("Error updating ticket status:", error);
    } else {
      setData(
        filteredData.map((item) =>
          item.id === boleto.id
            ? { ...item, comprado: true, apartado: false }
            : item
        )
      );
    }
  };

  const eliminarBoletoApartado = async (boleto) => {
    const confirmed = window.confirm(
      `Seguro que quieres eliminar este boleto? \n \n  ${boleto.nombre} - ${boleto.num_boletos}`
    );
    if (!confirmed) {
      return;
    }
    const { data, error } = await supabase
      .from("boletos")
      .delete()
      .eq("id", boleto.id);

    if (error) {
      console.error("Error deleting ticket:", error);
    } else {
      setData(filteredData.filter((item) => item.id !== boleto.id));
    }
  };

  const [status, setStatus] = useState("default");
  const [error, setError] = useState(null);

  const fetchPaymentStatus = async (boleto) => {
    setStatus("cargando...");
    const oxxo_id = boleto.oxxo_id;

    try {
      const response = await axios.post(
        "https://www.raffly.com.mx/api/payment-status-oxxo",
        { oxxo_id }
      );

      const data = response.data; // Axios already parses JSON

      if (data.status === "succeeded") {
        setStatus("Pagado");
        handleSuccesfulStatus(boleto); // Ensure handleSuccesfulStatus is defined
      } else if (data.status === "requires_action") {
        setStatus("Pendiente de pago");
        alert("Pendiente de pago o aun no se refleja");
      } else {
        setStatus("Desconocido");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSuccesfulStatus = async (boleto) => {
    const { data, error } = await supabase
      .from("boletos")
      .update({ comprado: true, oxxo: false })
      .eq("id", boleto.id);

    if (error) {
      console.error("Error updating data: ", error);
    } else {
      console.log("Data updated successfully: ", data);
      setData(
        filteredData.map((item) =>
          item.id === boleto.id
            ? { ...item, comprado: true, oxxo: false }
            : item
        )
      );
    }
  };

  const findDuplicates = () => {
    const allNumBoletos = data.flatMap((boleto) => boleto.num_boletos);

    const numBoletosSet = new Set();
    const duplicates = [];

    // Iterate through allNumBoletos to find duplicates
    allNumBoletos.forEach((num) => {
      if (numBoletosSet.has(num)) {
        if (!duplicates.includes(num)) {
          duplicates.push(num);
        }
      } else {
        numBoletosSet.add(num);
      }
    });

    return duplicates;
  };

  const handleCheckDuplicates = () => {
    const duplicates = findDuplicates();
    if (duplicates.length > 0) {
      alert(`Numeros duplicados: ${duplicates.join(", ")}`);
      setSearchNumber(String(duplicates[0]));
      setDuplicados(duplicates);
    } else {
      alert("No se encontraron duplicados.");
    }
  };

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

  // Filtering data based on search term and number in num_boletos
  const handleNumberSearch = (e) => {
    setSearchNumber(e.target.value);
  };

  // Filtering data based on search term and number in num_boletos or oportunidades
  const filteredData = sortedData.filter((item) => {
    const nombreMatch = item.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const numberMatch = item.num_boletos.some(
      (num) => num.toString() === searchNumber
    );

    // Check if item.oportunidades exists and is an array before searching
    const oportunidadesMatch =
      item.oportunidades && item.oportunidades.length > 0
        ? item.oportunidades.some(
            (oportunidad) => oportunidad.toString() === searchNumber
          )
        : false;

    const telefonoMatch = item.telefono
      ? item.telefono.toString().includes(searchTelefono.toString())
      : false;

    // Determine the estado based on item properties
    const estado =
      item.comprado === true
        ? "Pagado"
        : item.oxxo === true
        ? "Pago pendiente oxxo"
        : item.apartado === true
        ? "Apartado"
        : null;

    // Match the selected estado or show all if no estado is selected
    const estadoMatch = selectedEstado === "" || estado === selectedEstado;

    return (
      nombreMatch &&
      (searchNumber === "" || numberMatch || oportunidadesMatch) &&
      (searchTelefono === "" || telefonoMatch) &&
      estadoMatch
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

  const handleExportCSV = (data) => {
    const confirmar = window.confirm("¿Deseas exportar los datos a CSV?");

    if (!confirmar) {
      return;
    }

    // Selecting specific columns and formatting num_boletos and oportunidades as strings
    const selectedColumns = data.map(
      ({
        nombre_rifa,
        id,
        id_rifa,
        nombre,
        email,
        telefono,
        num_boletos,
        oportunidades,
        estado_mx,
        comprado,
        apartado,
        oxxo,
        precio,
      }) => ({
        nombre_rifa,
        id,
        id_rifa,
        nombre,
        email,
        telefono,
        num_boletos: JSON.stringify(num_boletos), // Convert num_boletos array to JSON string
        oportunidades: JSON.stringify(oportunidades), // Convert oportunidades array to JSON string
        estado_mx,
        comprado,
        apartado,
        oxxo,
        precio,
        valor: num_boletos.length * precio,
      })
    );

    // Convert to CSV using PapaParse
    const csv = Papa.unparse(selectedColumns);

    // Log the CSV to the console for debugging
    console.log("Generated CSV:", csv);

    // Create a blob from the CSV string
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Create a download link and trigger the download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Log to confirm the download process
    console.log("CSV download initiated.");
  };

  const abrirWhatsapp = (telefono) => {
    console.log(telefono);
    const url = "https://api.whatsapp.com/send/?phone=" + telefono;
    window.open(url, "_blank");
  };

  const parseDate = (dateString) => {
    return new Date(dateString);
  };

  const ButtonWithDateCheck = ({ item }) => {
    const today = new Date();
    const apartadoFecha = parseDate(item.apartado_fecha);

    // Check if apartado_fecha is before today's date
    const isBeforeToday = apartadoFecha < today;

    return (
      <div>
        {isBeforeToday && (
          <button
            style={{
              cursor: "pointer",
              backgroundColor: "#DC3545",
              color: "white",
              padding: "10px",
              borderRadius: "15px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              border: "none",
              fontFamily: "Poppins",
              fontSize: "12px",
              width: "80px",
            }}
            onClick={() => eliminarBoletoApartado(item)}
          >
            Eliminar
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      className="boletos-dashboard"
    >
      <CustomAlertDialog
        open={open}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        boleto={boletoItem}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
        className="boletos-dashboard-top"
      >
        <h2 style={{ padding: "10px", margin: "10px" }}>Boletos</h2>

        <div className="select-container">
          <select
            id="rifasSelector"
            onChange={handleRifaChange}
            value={selectedName}
            placeholder="Elegir Rifa"
            style={{
              width: "200px",
              height: "2.6rem",
              color: "black",
              padding: "10px",

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

        <input
          type="text"
          id="nombreInput"
          value={searchTerm}
          onChange={handleNombreSearch}
          placeholder="Buscar por nombre"
          style={{
            width: "200px",
            height: "2.6rem",
            color: "black",
            padding: "10px",

            borderRadius: "15px",
            border: "1px solid #ccc",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        />

        <input
          type="text"
          id="numberInput"
          value={searchNumber}
          onChange={handleNumberSearch}
          placeholder="Buscar por boleto"
          style={{
            width: "200px",
            height: "2.6rem",
            color: "black",
            padding: "10px",

            borderRadius: "15px",
            border: "1px solid #ccc",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        />

        <input
          type="text"
          id="telefonoInput"
          value={searchTelefono}
          onChange={(e) => setSearchTelefono(e.target.value)}
          placeholder="Buscar por telefono"
          style={{
            width: "200px",
            height: "2.6rem",
            color: "black",
            padding: "10px",

            borderRadius: "15px",
            border: "1px solid #ccc",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        />

        <div className="select-container">
          <select
            id="estadoSelect"
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            style={{
              width: "200px",
              height: "2.6rem",
              color: "black",
              padding: "10px",

              borderRadius: "15px",
              border: "1px solid #ccc",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <option value="">Todos</option>
            <option value="Pagado">Pagado</option>
            <option value="Pago pendiente oxxo">Pago pendiente oxxo</option>
            <option value="Apartado">Apartado</option>
          </select>
        </div>

        <button
          style={{
            margin: "10px",
            padding: "10px",
            borderRadius: "15px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            fontFamily: "Poppins",
            height: "3.6rem",
          }}
          onClick={handleCheckDuplicates}
        >
          Buscar Numeros Duplicados
        </button>

        <button
          style={{
            padding: "10px",
            margin: "10px",
            width: "200px",
            fontFamily: "Poppins",
            borderRadius: "15px",
            backgroundColor: "#6FCF85",
          }}
          onClick={() => handleExportCSV(data)}
          disabled={loading}
        >
          {loading ? "Exporting..." : "Exportar Boletos a Excel"}
        </button>

        {duplicados.length > 0 && (
          <p
            style={{
              color: "red",
              marginLeft: "10px",
              marginTop: "10px",
              fontWeight: "bold",
              fontFamily: "Poppins",
              fontSize: "14px",
              textAlign: "center",
              padding: "10px",
            }}
          >
            Numeros Duplicados: {duplicados.join(", ")}
          </p>
        )}
      </div>
      <div
        style={{
          overflowY: "auto",
          maxHeight: "80vh",
          width: "100%",
          marginLeft: "10px",
          padding: "10px",
        }}
        className="table-container"
      >
        <table
          style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
          className="content-table"
        >
          <thead>
            <tr>
              <th
                style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                onClick={() => handleSort("nombre")}
              >
                Nombre y Apellido <i className="material-icons">swap_vert</i>
              </th>

              <th>Telefono</th>
              <th>Email</th>
              <th>Estado</th>

              <th>Valor</th>

              <th>Boletos y Oportunidades</th>

              <th
                style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                onClick={() => handleSort("comprado")}
              >
                Estado <i className="material-icons">swap_vert</i>
              </th>

              <th> </th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td
                  style={{
                    cursor: "pointer",
                    whiteSpace: "nowrap",

                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onClick={() => abrirWhatsapp(item.telefono)}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {item.nombre}
                    <i style={{ color: "#007BFF" }} className="material-icons">
                      chat
                    </i>
                  </div>
                </td>

                <td>{item.telefono}</td>
                <td>{item.email}</td>
                <td>{item.estado_mx}</td>

                <td>{"$" + item.precio * item.num_boletos.length}</td>
                <td>
                  <div
                    style={{
                      maxHeight: "100px",
                      overflow: "auto",
                    }}
                  >
                    {item.num_boletos.join(", ")},{" "}
                    {item.oportunidades ? (
                      <div style={{ color: "#6FCF85" }}>
                        {" "}
                        {item.oportunidades.join(", ")}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </td>

                <td style={{ whiteSpace: "nowrap" }}>
                  {item.comprado === true
                    ? "Pagado"
                    : item.oxxo === true
                    ? "Pago pendiente oxxo"
                    : item.apartado === true
                    ? "Apartado"
                    : "Error"}
                </td>
                <td
                  style={{
                    gap: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {item.apartado === true && (
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexDirection: "column",
                      }}
                    >
                      <button
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#6FCF85",
                          color: "white",
                          padding: "10px",
                          borderRadius: "15px",
                          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                          border: "none",
                          fontFamily: "Poppins",
                          fontSize: "12px",
                          width: "80px",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => {
                          setOpen(true);
                          setBoletoItem(item);
                        }}
                      >
                        Confirmar
                      </button>

                      <ButtonWithDateCheck item={item} />
                    </div>
                  )}

                  {item.oxxo === true && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {" "}
                        <button
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#3D9BE9",
                            color: "white",
                            padding: "10px",
                            borderRadius: "15px",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                            border: "none",
                            fontFamily: "Poppins",
                            fontSize: "12px",
                            width: "150px",
                          }}
                          onClick={() => fetchPaymentStatus(item)}
                        >
                          Verificar pago oxxo
                        </button>
                        <ButtonWithDateCheck item={item} />
                      </div>
                    </>
                  )}
                </td>
                <td>
                  {item.comprado === true && <></>}

                  {item.oxxo === true && (
                    <CountdownTimer
                      fecha={item.apartado_fecha}
                      color={"transparent"}
                      colorLetras={"black"}
                    />
                  )}

                  {item.apartado === true && (
                    <CountdownTimer
                      fecha={item.apartado_fecha}
                      color={"transparent"}
                      colorLetras={"black"}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoletosDashboard;

/*
 <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("id")}
              >
                ID Boleto <i className="material-icons">swap_vert</i>
              </th>


               <td>{item.id}</td>

               */
