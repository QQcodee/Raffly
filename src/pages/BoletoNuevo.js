//import css
import "./BoletoNuevo.css";

const BoletoNuevo = () => {
  return (
    <div className="ticket" style={{ backgroundColor: "rgb(82, 167, 99)" }}>
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
  );
};

export default BoletoNuevo;
