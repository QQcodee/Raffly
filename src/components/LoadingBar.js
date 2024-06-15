const LoadingBar = ({ boletosVendidos, rifa }) => {
  const percentage = (boletosVendidos / rifa.numboletos) * 100;

  return (
    <div className="loading-bar-container">
      <div className="loading-bar">
        <div
          className="loading-bar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p
        style={{
          color: "black",
          top: "-22px",
          position: "relative",
          fontWeight: "400",
          fontSize: "14px",
        }}
      >
        {boletosVendidos}/{rifa.numboletos} vendidos
      </p>
    </div>
  );
};

export default LoadingBar;
