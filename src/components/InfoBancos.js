const InfoBancos = ({ info }) => {
  console.log(info);
  return (
    <>
      {info === undefined ? null : (
        <div
          style={{
            marginTop: "50px",
            width: "auto",
            height: "auto",
            backgroundColor: "#D1D1D1",
            display: "flex",
            alignItems: "center",

            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {" "}
            <img
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
              }}
              src={info[0].image_url}
            ></img>
          </div>
          <hr
            style={{
              width: "80%",
            }}
          ></hr>

          {info[0].bancos.map((banco, index) => (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <img
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "white",
                    objectFit: "contain",
                  }}
                  src={banco.img}
                ></img>
              </div>

              <ul
                style={{
                  listStyleType: "none",
                  padding: "0",
                  margin: "0",
                  fontSize: "17px",
                  textAlign: "center",
                }}
                key={index}
              >
                <li>
                  Banco: <strong>{banco.banco}</strong>
                </li>
                <li>
                  Clabe: <strong>{banco.clabe}</strong>
                </li>

                <li>
                  Nombre: <strong>{banco.nombre}</strong>
                </li>
              </ul>
              <hr
                style={{
                  width: "80%",
                }}
              ></hr>
            </>
          ))}
        </div>
      )}
    </>
  );
};

export default InfoBancos;
