import FooterGlobal from "../components/FooterGlobal";
import HeaderGlobal from "../components/HeaderGlobal";
import { useNavigate } from "react-router-dom";

import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <>
      <HeaderGlobal />
      <div
        style={{
          padding: "50px",
          textAlign: "center",
          fontFamily: "Poppins",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 className="titulo-landing">
          Raffly - Tu Solución para Rifas y Sorteos en Línea{" "}
        </h2>
        <h1 className="sub-landing">
          Sistema de Rifas y Sorteos Completamente Automatizado
        </h1>

        <hr
          style={{
            marginBottom: "20px",
            border: "1px solid #2e2e2e",
            width: "50%",
          }}
        ></hr>

        <p style={{ marginTop: "40px", fontSize: "32px" }}>¿Qué es Raffly?</p>
        <p
          style={{
            fontSize: "21px",
            maxWidth: "50ch",
            textAlign: "center",
            marginBottom: "5px",
          }}
        >
          {" "}
          Raffly es la plataforma definitiva para crear y administrar rifas de
          manera sencilla y sin necesidad de desarrollar un sitio web. Nosotros
          nos encargamos de todo: desde el hosting de tus rifas hasta la gestión
          de pagos y la administración de boletos.
        </p>
        <button
          style={{
            marginTop: "20px",
            marginBottom: "60px",
            backgroundColor: "#6FCF85",
            color: "white",
            fontWeight: "bold",
            fontSize: "46px",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: "10px",
            padding: "10px 20px",
            cursor: "pointer",
            border: "none",
          }}
          onClick={() =>
            window.open(
              "https://api.whatsapp.com/send/?phone=6143035198&text=Hola me interesa ser socio raffly"
            )
          }
        >
          Contactanos
        </button>

        <hr
          style={{
            marginBottom: "60px",
            border: "1px solid #2e2e2e",
            width: "40%",
          }}
        ></hr>

        <h2
          style={{ marginBottom: "60px", fontWeight: "bold", fontSize: "36px" }}
        >
          Características Destacadas
        </h2>
      </div>

      <div
        style={{
          maxWidth: "500px",
          display: "flex",
          gap: "20px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
          fontSize: "18px",
          fontFamily: "Poppins",
        }}
      >
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            alignItems: "center",
            marginBottom: "60px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <h2>Publicaciones Ilimitadas de Rifas</h2>
            <p>Crea tantas rifas como desees sin restricciones.</p>
          </div>

          <div>
            <img
              style={{
                width: "auto",
                height: "60px",
                zIndex: "10",
                marginBottom: "30px",
              }}
              src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/infinito.png"
            ></img>
          </div>
        </section>

        <hr
          style={{
            marginBottom: "60px",
            border: "1px solid #2e2e2e",
            width: "5%",
          }}
        ></hr>

        <section
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",

            alignItems: "center",
            marginBottom: "60px",
          }}
        >
          <div>
            <img
              style={{ width: "auto", height: "100px", zIndex: "10" }}
              src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/customize.png"
            ></img>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <h2>Personalización Total</h2>
            <p style={{ maxWidth: "75ch", textAlign: "left" }}>
              Define la cantidad de boletos disponibles y establece la fecha del
              sorteo según tus necesidades.
            </p>
          </div>
        </section>

        <hr
          style={{
            marginBottom: "60px",
            border: "1px solid #2e2e2e",
            width: "5%",
          }}
        ></hr>

        <section
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            alignItems: "center",
            marginBottom: "60px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <h2>Máquina de la Suerte</h2>
            <p>
              Permite a los participantes obtener boletos al azar para mayor
              emoción.
            </p>
          </div>
          <div>
            <img
              style={{ width: "auto", height: "100px", zIndex: "10" }}
              src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/dados.png"
            ></img>
          </div>
        </section>

        <hr
          style={{
            marginBottom: "60px",
            border: "1px solid #2e2e2e",
            width: "5%",
          }}
        ></hr>

        <section
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            alignItems: "center",
            marginBottom: "60px",
          }}
        >
          <div>
            <img
              style={{ width: "auto", height: "80px", zIndex: "10" }}
              src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/Numeracion.png"
            ></img>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <h2>Numeración conforme a la Lotería Nacional</h2>
            <p>Asegura la transparencia y confianza en cada rifa.</p>
          </div>
        </section>

        <hr
          style={{
            marginBottom: "60px",
            border: "1px solid #2e2e2e",
            width: "5%",
          }}
        ></hr>

        <section
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            alignItems: "center",
            marginBottom: "60px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <h2>Múltiples Métodos de Pago</h2>
            <p>Acepta pagos con tarjeta, Oxxo Pago y transferencia bancaria</p>
          </div>
          <div>
            <img
              style={{ width: "auto", height: "100px", zIndex: "10" }}
              src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/payment_method_svgrepo_com_1.png"
            ></img>
          </div>
        </section>
        <hr
          style={{
            marginBottom: "60px",
            border: "1px solid #2e2e2e",
            width: "5%",
          }}
        ></hr>

        <section
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            alignItems: "center",
            marginBottom: "60px",
          }}
        >
          <div>
            <img
              style={{ width: "auto", height: "80px", zIndex: "10" }}
              src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/ticket.png"
            ></img>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <h2>Generador de Tickets</h2>
            <p>
              Genera y distribuye boletos automáticamente a los participantes.
            </p>
          </div>
        </section>

        <hr
          style={{
            marginBottom: "60px",
            border: "1px solid #2e2e2e",
            width: "5%",
          }}
        ></hr>

        <section
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <h2>Verificador de Boletos</h2>
            <p>
              Facilita la verificación de boletos comprados y pendientes de
              pago.
            </p>
          </div>

          <div>
            <img
              style={{ width: "auto", height: "120px", zIndex: "10" }}
              src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/verificador.png"
              alt="verificador"
            ></img>
          </div>
        </section>
        <button
          onClick={() =>
            window.open(
              "https://www.raffly.com.mx/Raffly-Oficial/Sorteo-Ejemplo/793ff25d-3646-4362-97bf-bfd8900222c5/448f23ad-9146-4df5-a466-d37143d5d445",
              "_blank"
            )
          }
          style={{
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "100px",
            marginBottom: "220px",
          }}
        >
          Ver Demostracion
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "60px",
            fontSize: "36px",
            fontWeight: "bold",
          }}
        >
          Panel de administración
        </h2>

        <div className="dashboard__section">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "flex-start",
              marginRight: "150px",
            }}
          >
            <ul>
              <li>Administracion simplificada</li>
              <li>Base de datos completa</li>
              <li>Busqueda y listado de usuarios</li>
              <li>Metricas detalladas de cada sorteo</li>
            </ul>
          </div>
          <div className="dashboard__img">
            <img src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/dashboard.png"></img>
          </div>
        </div>

        <h2
          style={{
            textAlign: "center",
            marginTop: "120px",
            fontWeight: "bold",
          }}
        >
          {" "}
          ¡Empieza Ahora!
        </h2>

        <h2 style={{ textAlign: "center", marginTop: "30px" }}>
          Descubre lo fácil que es crear y gestionar tus rifas con Raffly.{" "}
          <br></br> <br></br> Regístrate hoy y empieza a disfrutar de todas las
          ventajas que nuestra plataforma tiene para ofrecer.
        </h2>

        <button
          style={{
            marginTop: "60px",
            marginBottom: "60px",
            backgroundColor: "#6FCF85",
            color: "white",
            fontWeight: "bold",
            fontSize: "46px",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: "10px",
            padding: "10px 20px",
            cursor: "pointer",
            border: "none",
          }}
          onClick={() =>
            window.open(
              "https://api.whatsapp.com/send/?phone=6143035198&text=Hola me interesa ser socio raffly"
            )
          }
        >
          Contactanos
        </button>
      </div>

      <FooterGlobal />
    </>
  );
};

export default Landing;

/*

<select name="state" id="state">
<option value="" selected="selected">SELECCIONA ESTADO</option>
<option value="USA">USA</option>
<option value="Aguascalientes">Aguascalientes</option>
<option value="Baja California">Baja California</option>
<option value="Baja California Sur">Baja California Sur</option>
<option value="Campeche">Campeche</option>
<option value="Chiapas">Chiapas</option>
<option value="Chihuahua">Chihuahua</option>
<option value="Ciudad de México">Ciudad de México</option>
<option value="Coahuila">Coahuila</option>
<option value="Colima">Colima</option>
<option value="Durango">Durango</option>
<option value="Estado de México">Estado de México</option>
<option value="Guanajuato">Guanajuato</option>
<option value="Guerrero">Guerrero</option>
<option value="Hidalgo">Hidalgo</option>
<option value="Jalisco">Jalisco</option>
<option value="Michoacán">Michoacán</option>
<option value="Morelos">Morelos</option>
<option value="Nayarit">Nayarit</option>
<option value="Nuevo León">Nuevo León</option>
<option value="Oaxaca">Oaxaca</option>
<option value="Puebla">Puebla</option>
<option value="Querétaro">Querétaro</option>
<option value="Quintana Roo">Quintana Roo</option>
<option value="San Luis Potosí">San Luis Potosí</option>
<option value="Sinaloa">Sinaloa</option>
<option value="Sonora">Sonora</option>
<option value="Tabasco">Tabasco</option>
<option value="Tamaulipas">Tamaulipas</option>
<option value="Tlaxcala">Tlaxcala</option>
<option value="Veracruz">Veracruz</option>
<option value="Yucatán">Yucatán</option>
<option value="Zacatecas">Zacatecas</option>
</select>

*/
