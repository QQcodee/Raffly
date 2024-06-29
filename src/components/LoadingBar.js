const LoadingBar = ({ boletosVendidos, rifa }) => {
  const percentage = (boletosVendidos / rifa.numboletos) * 100;

  return (
    <div className="loading-bar-container">
      <div className="loading-bar">
        <div
          className="loading-bar-fill"
          style={{
            width: `${percentage}%`,
            fontFamily: "Poppins",

            fontWeight: "600",
          }}
        >
          {" "}
          {boletosVendidos}/{rifa.numboletos}
        </div>
      </div>
    </div>
  );
};

export default LoadingBar;
