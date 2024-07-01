const LoadingBarRender = ({ boletosVendidos, rifa }) => {
  const percentage = ((boletosVendidos + 1) / rifa.numboletos) * 100;

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
            fontFamily: "Poppins",

            fontWeight: "600",
            backgroundColor: "#6FCF85",
          }}
        ></div>
      </div>
      <p
        style={{
          color: percentage < 50 ? "white" : "#3D3D3D",
          position: percentage < 50 ? "relative" : "relative",
          left: percentage < 50 ? "5px" : "-30px",
          left: percentage > 80 ? "-5px" : "-30px",
          top: "-19px",
          fontFamily: "Poppins",

          fontWeight: "600",
          fontSize: "15px",
        }}
      >{`${boletosVendidos + 1}/${rifa.numboletos}`}</p>
    </div>
  );
};

export default LoadingBarRender;
