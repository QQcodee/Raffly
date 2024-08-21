import "./PresetMensajes.css";
import { useState } from "react";

const PresetMensajes = ({ item, currentRifa }) => {
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const Popup = ({ handleClose, show, children }) => {
    return (
      <div className={`popup-mensajes ${show ? "show" : ""}`}>
        <div className="popup-inner-mensajes">
          <p
            style={{ fontSize: "20px", fontFamily: "poppins" }}
            className="close-btn"
            onClick={handleClose}
          >
            <i className="material-icons">close</i>
          </p>
          {children}
        </div>
      </div>
    );
  };

  const ticketNumbersWhatsapp = item.num_boletos.join(", ");

  const MensajeConfirmacionPago = () => {
    if (item.oportunidades?.length > 0) {
      const ticketOpotunidadesWhatsapp = item.oportunidades.join(", ");
      window.open(
        `https://api.whatsapp.com/send/?phone=52${item.telefono}
          "&text=Recibimos tu pago para el sorteo (${encodeURIComponent(
            currentRifa.nombre
          )}) 
        %0A %0A Nombre:${item.nombre}  %0A Telefono:${
          item.telefono
        }  %0A Estado:${item.estado_mx}  %0A%0A Total:$${
          item.precio * item.num_boletos.length
        }  %0A %0ANumeros: ${ticketNumbersWhatsapp}
        %0A %0AOportunidades: ${ticketOpotunidadesWhatsapp} %0A%0A Puedes ver tu boleto en el siguiente enlace: %0Ahttps://www.raffly.com.mx/verificador/${
          item.email
        }`
      );
    } else {
      window.open(
        `https://api.whatsapp.com/send/?phone=52${item.telefono}
              "&text=Recibimos tu pago para el sorteo (${encodeURIComponent(
                currentRifa.nombre
              )}) 
            %0A %0A Nombre: ${item.nombre}  %0A Telefono: ${
          item.telefono
        }  %0A Estado: ${item.estado_mx} %0A%0A Total: $${
          item.precio * item.num_boletos.length
        }  %0A %0ANumeros: ${ticketNumbersWhatsapp}
            %0A%0A Puedes ver tu boleto en el siguiente enlace: %0Ahttps://www.raffly.com.mx/verificador/${
              item.email
            }`
      );
    }
  };

  const MensajeInformacion = () => {
    if (item.oportunidades?.length > 0) {
      const ticketOpotunidadesWhatsapp = item.oportunidades.join(", ");
      window.open(
        `https://api.whatsapp.com/send/?phone=52${item.telefono}
            "&text=Boleto para el sorteo (${encodeURIComponent(
              currentRifa.nombre
            )}) 
          %0A %0ANombre:${item.nombre}  %0ATelefono:${
          item.telefono
        }  %0AEstado:${item.estado_mx}  %0A%0ATotal:$${
          item.precio * item.num_boletos.length
        }  %0A%0ANumeros: ${ticketNumbersWhatsapp} %0A %0AOportunidades: ${ticketOpotunidadesWhatsapp}  %0A%0AMetodos de pago en el siguiente enlace: %0Ahttps://www.raffly.com.mx/${encodeURIComponent(
          currentRifa.socio.replace(/\s+/g, "-")
        )}/${encodeURIComponent(
          currentRifa.user_id
        )}  %0A%0A Puedes ver el estado de tu boleto en el siguiente enlace: %0Ahttps://www.raffly.com.mx/verificador/${
          item.email
        } `
      );
    } else {
      window.open(
        `https://api.whatsapp.com/send/?phone=52${item.telefono}
                "&text=Boleto para el sorteo (${encodeURIComponent(
                  currentRifa.nombre
                )}) 
              %0A %0ANombre:${item.nombre}  %0ATelefono:${
          item.telefono
        }  %0AEstado:${item.estado_mx}  %0A%0ATotal:$${
          item.precio * item.num_boletos.length
        }  %0A %0ANumeros: ${ticketNumbersWhatsapp} %0A%0AMetodos de pago en el siguiente enlace: %0Ahttps://www.raffly.com.mx/${encodeURIComponent(
          currentRifa.socio.replace(/\s+/g, "-")
        )}/${encodeURIComponent(
          currentRifa.user_id
        )}  %0A%0A Puedes ver el estado de tu boleto en el siguiente enlace: %0Ahttps://www.raffly.com.mx/verificador/${
          item.email
        } `
      );
    }
  };

  const IrWhatsapp = () => {
    window.open(`https://api.whatsapp.com/send/?phone=52${item.telefono}`);
  };

  return (
    <>
      <Popup show={showPopup} handleClose={togglePopup}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <h3>Mensajes Predeterminados</h3>

          <hr style={{ width: "80%", border: "1px solid black" }} />
          <p>
            Para : <strong>{item.nombre}</strong>
          </p>

          <button
            style={{ backgroundColor: "black", color: "white", width: "80%" }}
            onClick={() => MensajeInformacion()}
          >
            Informacion de Boleto
          </button>

          {item.comprado === true && (
            <button
              style={{
                backgroundColor: "#6FCF85",
                color: "white",
                width: "80%",
              }}
              onClick={() => MensajeConfirmacionPago()}
            >
              Confirmacion de pago
            </button>
          )}

          <hr style={{ width: "80%", border: "1px solid black" }} />
          <button
            style={{ backgroundColor: "white", color: "black", width: "80%" }}
            onClick={() => IrWhatsapp()}
          >
            <img
              src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/whatsapp.png"
              alt="logo"
              style={{
                width: "50px",
                margin: "auto",
              }}
            />
          </button>
        </div>
      </Popup>
      <i
        onClick={() => togglePopup()}
        style={{ color: "#007BFF" }}
        className="material-icons"
      >
        chat
      </i>
    </>
  );
};

export default PresetMensajes;
