import React, { useState } from "react";

const CalcularOps = () => {
  const [boleto, setBoleto] = useState(777);
  const [numerosAdicionales, setNumerosAdicionales] = useState([]);

  const [boletosEmitir, setBoletosEmitir] = useState(2000);

  const columnas = 10000 / boletosEmitir;

  const calcular = () => {
    const numeros = [];

    for (let i = 1; i < columnas; i++) {
      const numero = boleto + boletosEmitir * i;
      numeros.push("," + numero);
    }

    setNumerosAdicionales(numeros);
  };

  return (
    <div>
      <h1>Calcular Ops</h1>
      {boleto}
      {numerosAdicionales}
      <h2>Columnas : {columnas}</h2>
      <h2>{numerosAdicionales.map}</h2>
      <button onClick={calcular}>Calcular</button>
    </div>
  );
};

export default CalcularOps;
