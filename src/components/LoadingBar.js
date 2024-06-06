const LoadingBar = ({ boletosVendidos, rifa }) => {
  const percentage = (boletosVendidos / rifa.numboletos) * 100;

  //falta funcion de calcular boletos vendidos por rifa

  return (
    <div className="loading-bar-container">
      <div className="loading-bar">
        <div
          className="loading-bar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p>
        {boletosVendidos}/{rifa.numboletos} vendidos
      </p>
    </div>
  );
};

export default LoadingBar;
