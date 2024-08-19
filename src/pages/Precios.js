import HeaderGlobal from "../components/HeaderGlobal";

import "./Precios.css";

const Precios = () => {
  return (
    <>
      <div
        style={{
          textAlign: "center",
          fontFamily: "Poppins",
          paddingTop: "80px",
          paddingBottom: "40px",
          paddingLeft: "20px",
          paddingRight: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
        }}
      >
        <h1
          style={{
            margin: "0",
            fontSize: "36px",
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          Organiza Rifas sin Complicaciones
        </h1>
        <h4 style={{ fontSize: "18px", fontWeight: "400" }}>
          Desde pequeñas rifas hasta grandes sorteos, tenemos un plan para cada
          organizador.
        </h4>
        <div className="div-grid-precios">
          <div
            style={{
              borderRadius: "15px 0 0 15px",
              borderRight: "1px solid #ccc",
              borderLeft: "1px solid #ccc",
            }}
            className="card-precios"
          >
            <section style={{ height: "10vh" }}>
              <h3>GRATIS</h3>
              <p>Perfecto para rifas pequeñas</p>
            </section>
            <button
              onClick={() =>
                window.open(
                  "https://api.whatsapp.com/send/?phone=6143035198&text=Hola me interesa contratar el plan gratis"
                )
              }
            >
              Empieza Gratis{" "}
            </button>
            <div
              style={{
                display: "flex",
                marginTop: "20px",
                alignItems: "center",
                gap: "10px",
                fontFamily: "Poppins",
              }}
            >
              <p style={{ fontSize: "27px", fontWeight: "600" }}>$0 MXN</p>
              <p style={{ fontSize: "20px" }}>en tu primera rifa</p>
            </div>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <ul>
              <li>Maximo 100 boletos por rifa</li>
              <li>Acceso al panel de administrador</li>
              <li>Soporte Basico</li>
              <li>Unicamente pagos con transferencia</li>
            </ul>
          </div>

          <div className="card-precios">
            <section style={{ height: "10vh" }}>
              <h3>BASICO</h3>
              <p>Ideal para rifas con mayor alcance</p>
            </section>
            <button
              onClick={() =>
                window.open(
                  "https://api.whatsapp.com/send/?phone=6143035198&text=Hola me interesa contratar el plan basico"
                )
              }
            >
              Comienza Ahora
            </button>
            <div
              style={{
                display: "flex",
                marginTop: "20px",
                alignItems: "center",
                gap: "10px",
                fontFamily: "Poppins",
              }}
            >
              <p style={{ fontSize: "27px", fontWeight: "600" }}>$699 MXN</p>
              <p style={{ fontSize: "20px" }}>por rifa</p>
            </div>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <ul>
              <li>Maximo 1,000 boletos</li>
              <li>Acceso al panel de administrador para 1 persona</li>

              <li>Acepta pagos con Tarjeta, OxxoPay y Transferencia</li>
              <li>Soporte Prioritario</li>
            </ul>
          </div>
          <div className="card-precios-destacado">
            <section style={{ height: "15vh" }}>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                {" "}
                <h3>ESTANDAR</h3>
                <p
                  style={{
                    fontSize: "19px",
                    backgroundColor: "#6FCF85",
                    padding: "5px",
                    borderRadius: "10px",
                    color: "white",
                    fontFamily: "Poppins",
                    fontWeight: "600",
                  }}
                >
                  Mas Popular
                </p>
              </div>
              <p>La opción ideal para gestionar rifas extensas</p>
            </section>
            <button
              onClick={() =>
                window.open(
                  "https://api.whatsapp.com/send/?phone=6143035198&text=Hola me interesa contratar el plan estantar"
                )
              }
            >
              Comienza Ahora
            </button>
            <div
              style={{
                display: "flex",
                marginTop: "20px",
                alignItems: "center",
                gap: "10px",
                fontFamily: "Poppins",
              }}
            >
              <p style={{ fontSize: "27px", fontWeight: "600" }}>$1,999 MXN</p>
              <p style={{ fontSize: "20px" }}>por rifa</p>
            </div>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <ul>
              <li>Maximo 10,000 boletos</li>
              <li>Acceso al panel de administrador para 3 personas</li>

              <li>Acepta pagos con Tarjeta, OxxoPay y Transferencia</li>
              <li>Soporte Prioritario</li>
            </ul>
          </div>

          <div
            style={{
              borderRadius: "0 15px 15px 0",
              borderRight: "1px solid #ccc",
            }}
            className="card-precios"
          >
            <section style={{ height: "10vh" }}>
              <h3>PROFESIONAL</h3>
              <p>La solución definitiva para rifas de cualquier magnitud</p>
            </section>
            <button
              onClick={() =>
                window.open(
                  "https://api.whatsapp.com/send/?phone=6143035198&text=Hola me interesa contratar el plan profesional"
                )
              }
            >
              Comienza Ahora
            </button>
            <div
              style={{
                display: "flex",
                marginTop: "20px",
                alignItems: "center",
                gap: "10px",
                fontFamily: "Poppins",
              }}
            >
              <p style={{ fontSize: "27px", fontWeight: "600" }}>$4,999 MXN</p>
              <p style={{ fontSize: "20px" }}>por rifa</p>
            </div>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <ul>
              <li>Maximo 60,000 boletos</li>
              <li>Acceso al panel de administrador para 10 personas</li>

              <li>Acepta pagos con Tarjeta, OxxoPay y Transferencia</li>
              <li>Soporte Prioritario</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Precios;
