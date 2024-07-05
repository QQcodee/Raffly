import React, { useState } from "react";

const CalcularOps = () => {
  const [boleto, setBoleto] = useState(7406);
  const [numerosAdicionales, setNumerosAdicionales] = useState([]);

  const [boletosEmitir, setBoletosEmitir] = useState(7500);
  const columnas = 60000 / boletosEmitir;

  const calcular = () => {
    const numeros = [];

    const col1 =
      boleto + (boletosEmitir - (boleto - (boletosEmitir - boleto + 1)));
    numeros.push(col1);
    const col2 =
      boleto + (boletosEmitir - (boleto - (boletosEmitir - boleto - 1)));
    numeros.push(col2);

    setNumerosAdicionales(numeros);
  };

  return (
    <div>
      <h1>Calcular Ops</h1>
      {boleto}, {numerosAdicionales}
      <h2>Columnas : {columnas}</h2>
      <h2>{numerosAdicionales.map}</h2>
      <button onClick={calcular}>Calcular</button>
    </div>
  );
};

export default CalcularOps;
