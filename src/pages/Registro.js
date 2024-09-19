import HeaderGlobal from "../components/HeaderGlobal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../UserContext";
import supabase from "../config/supabaseClient";
import LoginSinHeader from "./LoginSinHeader";
import FooterGlobal from "../components/FooterGlobal";
import SocioConfig from "./dashboard/SocioConfig";

const Registro = () => {
  const navigate = useNavigate();
  const { user, userMetadata } = useUser();
  const [paso, setPaso] = useState(1);

  console.log(user, userMetadata);

  return (
    <>
      <HeaderGlobal />

      {!user && <LoginSinHeader />}

      {user && userMetadata === undefined && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "50px",
              height: "90vh",

              backgroundColor: "#FAF9F6",
            }}
          >
            <form
              style={{
                backgroundColor: "white",
                padding: "20px",
                width: "100%",
                height: "100%",
                display: paso === 1 ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <h2 style={{ marginBottom: "40px", textAlign: "center" }}>
                  Registro de Socio
                </h2>
                <label>Nombre de socio:</label>
                <input
                  placeholder="Nombre de socio: (Ejemplo: Rifas el Trebol de la suerte)"
                  style={{ borderRadius: "5px" }}
                  type="text"
                ></input>

                <label htmlFor="phone">Telefono</label>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <select
                    name="countryCode"
                    style={{
                      width: "100px",

                      padding: "6px",
                      margin: "10px 0 20px 0",
                    }}
                    id="countryCode"
                  >
                    <option value="">Pais</option>
                    <option value="52">Mexico</option>
                    <option value="1">USA</option>
                  </select>
                  <input
                    type="phone"
                    placeholder="Numero de whatsapp"
                    id="phone"
                  />
                </div>

                <label htmlFor="estado">Estado</label>
                <select name="estado" id="estado">
                  <option value="">SELECCIONA ESTADO</option>
                  <option value="USA">USA</option>
                  <option value="Aguascalientes">Aguascalientes</option>
                  <option value="Baja California">Baja California</option>
                  <option value="Baja California Sur">
                    Baja California Sur
                  </option>
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
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <button
                  style={{ fontFamily: "Poppins", backgroundColor: "#343A40" }}
                  type="button"
                  onClick={() => setPaso(paso - 1)}
                >
                  Anterior
                </button>
                <button
                  style={{ fontFamily: "Poppins", backgroundColor: "#6FCF85" }}
                  type="button"
                  onClick={() => setPaso(paso + 1)}
                >
                  Siguiente
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <FooterGlobal />
    </>
  );
};

export default Registro;
