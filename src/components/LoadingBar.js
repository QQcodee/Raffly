const LoadingBar = ({ boletosVendidos, rifa }) => {
  const percentage = (boletosVendidos + 1 / rifa.numboletos) * 100;

  return (
    <div className="loading-bar-container">
      <div className="loading-bar">
        <div
          className="loading-bar-fill"
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
          color: percentage < 50 ? "black" : "white",
          position: percentage < 50 ? "relative" : "relative",
          left: percentage < 50 ? "5px" : "-30px",
          left: percentage > 90 ? "0px" : "0px",
          top: "-22px",
          fontFamily: "Poppins",

          fontWeight: "600",
          fontSize: "15px",
        }}
      >{`${boletosVendidos + 1}/${rifa.numboletos}`}</p>
    </div>
  );
};

export default LoadingBar;
