//import css
import "./BoletoNuevo.css";
import { useState } from "react";

const BoletoNuevo = () => {
  const [isBackContainerHovered, setIsBackContainerHovered] = useState(false);

  const handleToggleHover = () => {
    setIsBackContainerHovered(!isBackContainerHovered);
  };
  return (
    <div
      className={`listing-container ${isBackContainerHovered ? "hovered" : ""}`}
    >
      {/* Back container */}
      <div className="back-container">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Fa62fd2b71dc44b42935b855203dfea10%2F3868ab2e4cca46628fb873787c9b9751"
          alt="Background"
          className="background-image"
          onClick={handleToggleHover}
        />
        <div className="eye-icon">
          <i className="material-icons" onClick={handleToggleHover}>
            visibility
          </i>
        </div>
      </div>

      {/* Front container */}
      <div className="front-container">
        {/* Logo and name */}
        <div className="logo-name-container">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F471f30dc7fc44194a6a6e33e22d8a6a9%2Fc1a175f6985f474398d722b4cbbbda9d"
            alt="Logo"
            className="logo"
          />
          <span className="name">Rifas el Pirata</span>
        </div>

        {/* Rifa name */}
        <div className="rifa-name">Combo Black #34</div>

        {/* Description */}
        <div className="description">6 camiones 7 bodegas</div>

        {/* Loading bar and time counter */}
        <div className="loading-bar-container">LoadingBar</div>

        {/* Price */}
        <div className="price">$149</div>
        <button onClick={handleToggleHover}>Ver imagen</button>
      </div>
    </div>
  );
};

export default BoletoNuevo;

/*<div className="ticket" style={{ backgroundColor: "rgb(82, 167, 99)" }}>
      <aside>MEDIO MILLÓN</aside>
      <section className="ticket__first-section">
        <section>
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fa62fd2b71dc44b42935b855203dfea10%2F8c55b7aa5f1042a8a26ef66c9ecf04d2"
            alt="logo"
          />
          <h4>Lotto Sorteos</h4>
        </section>
        <section>
          <strong>Boleto:</strong>
          <div>
            <span>003</span>
            <ul></ul>
          </div>
        </section>
        <ul>
          <li>
            <p>
              <strong>SORTEO:</strong>
            </p>
            <p>MEDIO MILLÓN</p>
          </li>
          <li>
            <p>
              <strong>NOMBRE:</strong>
            </p>
            <p>CRUZ ALBERTO</p>
          </li>
          <li>
            <p>
              <strong>APELLIDO:</strong>
            </p>
            <p>LEAL CASTILLO</p>
          </li>
          <li>
            <p>
              <strong>ESTADO:</strong>
            </p>
            <p>NUEVO LEÓN</p>
          </li>
          <li>
            <p>
              <strong>PAGADO:</strong>
            </p>
            <p>PAGADO</p>
          </li>
          <li>
            <p>
              <strong>COMPRA:</strong>
            </p>
            <p>Jun 06 2024 23:26:33</p>
          </li>
        </ul>
      </section>
      <section
        className="ticket__second-section"
        style={{
          backgroundImage:
            'url("https://cdn.builder.io/api/v1/image/assets%2Fa62fd2b71dc44b42935b855203dfea10%2F9e24c1686e134cceaa3922e7e9b75d24")',
        }}
      ></section>
      <section className="ticket__third-section">
        <h4>¡MUCHA SUERTE!</h4>
      </section>
      <aside>MEDIO MILLÓN</aside>
    </div>
    */

/*
    .ticket {
  width: 360px;
  height: 550px;
  margin: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
}

.ticket > aside:first-of-type {
  right: 70px;
}

.ticket > aside:first-of-type,
.ticket > aside:last-of-type {
  position: absolute;
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
  bottom: 258px;
  width: 550px;
  z-index: 1000;
  text-align: center;
  color: #fff;
  font-weight: bolder;
  text-transform: uppercase;
  font-size: 21px;
  letter-spacing: 10px;
  z-index: 0;
  font-family: "SEGOE UI BOLD";
  margin: 0;
  padding: 0;
}

.ticket > aside:last-of-type {
  left: 67px;
}

.ticket > section {
  background-color: #fff;
  font-family: "BAHNSCHRIFT";
}

.ticket .ticket__first-section > section:first-of-type > img {
  height: 75px;
  width: auto;
}

.ticket .ticket__first-section {
  margin: 3px 32px;
}

.ticket .ticket__first-section > section:first-of-type {
  padding: 3px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ticket .ticket__first-section > section:nth-of-type(2) {
  border-top: 2px dashed #000;
  border-bottom: 2px dashed #000;
  padding: 10px;
  font-size: 17px;
  display: flex;
  height: 90px;
}

.ticket .ticket__first-section > section:nth-of-type(2) > div {
  display: flex;
  flex-direction: column;
  color: red;
  font-weight: 700;
  flex-grow: 1;
  align-items: center;
  font-family: "POPPINS SEMI BOLD";
}

.ticket .ticket__first-section > section:nth-of-type(2) > div > ul {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
}

.ticket .ticket__first-section > ul {
  list-style-type: none;
  padding: 0 10px;
  margin: 10px 0 0;
  height: 172px;
}

.ticket .ticket__first-section > ul > li {
  height: 28px;
  display: flex;
}

.ticket .ticket__first-section > ul > li > p {
  margin: 0;
  font-size: 13px;
}

.ticket .ticket__first-section > ul > li > p:first-of-type {
  width: 75px;
}

.ticket .ticket__first-section > ul > li > p:nth-of-type(2) {
  margin-left: 2px;
  font-size: 12px;
  text-transform: uppercase;
  color: red;
  font-weight: 700;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  font-family: "POPPINS SEMI BOLD";
}

.ticket .ticket__first-section > section:first-of-type h4 {
  font-size: 15px;
  font-weight: bolder;
  text-transform: uppercase;
  margin: 0 0 0 10px;
}

.ticket .ticket__second-section {
  height: 178px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  margin: 0 32px 3px;
}

.ticket .ticket__third-section {
  margin: 0 32px 3px;
}

.ticket .ticket__third-section > h4 {
  margin: 0;
  padding: 5px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
  font-size: 17px;
  text-transform: uppercase;
  font-weight: 900;
}


*/
