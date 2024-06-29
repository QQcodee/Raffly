const LoadingBarRender = ({ boletosVendidos, rifa }) => {
  const percentage = (boletosVendidos / rifa.numboletos) * 100;

  return (
    <div
      style={{
        backgroundColor: "#3D3D3D",
        borderRadius: "35px",
        height: "30px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        border: "none",
      }}
      className="loading-bar-container-render"
    >
      <div className="loading-bar-render">
        <div
          className="loading-bar-fill-render"
          style={{
            width: `${percentage}%`,
            backgroundColor: "#6FCF85",
            fontFamily: "Poppins",

            fontWeight: "600",
          }}
        >
          {`${boletosVendidos}/${rifa.numboletos}`}
        </div>
      </div>
    </div>
  );
};

export default LoadingBarRender;
