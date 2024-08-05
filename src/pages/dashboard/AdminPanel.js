import supabase from "../../config/supabaseClient";
import { useEffect, useState } from "react";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  const [open, setOpen] = useState(false);

  const [userAgregar, setUseragregar] = useState("");

  const { userRole } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === "Admin") {
      return;
    } else {
      navigate("/");
    }
  }, [userRole]);

  const CustomAlertDialog = ({ open, handleClose, handleConfirm, user }) => {
    const [creditos, setCreditos] = useState(0);

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
          {"Agregar creditos"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {user.nombre_negocio}
            <br />
            <br />
            Cantidad de creditos a agregar:
            <input
              type="number"
              value={creditos}
              onChange={(e) => setCreditos(e.target.value)}
            />
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
            onClick={() => handleConfirm(user.user_id, creditos)}
            color="primary"
            autoFocus
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = (user, creditos) => {
    setOpen(false);
    console.log("confirmar", user, creditos);

    const agregarCreditos = async () => {
      const { data, error } = await supabase
        .from("user_metadata")
        .update({ creditos: creditos })
        .eq("user_id", user);
      if (error) {
        console.log(error);
      }
    };

    agregarCreditos();

    setUsers(users.map((u) => (u.user_id === user ? { ...u, creditos } : u)));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("user_metadata").select();
      if (error) {
        console.log(error);
      }
      if (data) {
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  const agregarCreditos = async (user_id, creditos) => {
    const confirmar = window.confirm("¿Deseas agregar creditos?");

    if (!confirmar) {
      return;
    }
    console.log(user_id, creditos);
  };

  return (
    <>
      <CustomAlertDialog
        open={open}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        user={userAgregar}
      />
      <h1>Admin Panel</h1>

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
              <th>Nombre Socio</th>
              <th>Creditos</th>
              <th>Creditos</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.nombre_negocio}</td>
                <td>{user.creditos}</td>

                <td>
                  <button
                    onClick={() => {
                      setUseragregar(user);
                      setOpen(true);
                    }}
                    className="button"
                  >
                    Agregar Creditos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminPanel;
