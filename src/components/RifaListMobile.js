import HeaderGlobal from "./HeaderGlobal";
import LoadingBarRender from "./LoadingBarRender";
import { useEffect, useState } from "react";

const RifaListMobile = ({ rifa }) => {
  console.log(rifa);
  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <div
          style={{
            height: "250px",
            width: "85vw",
            backgroundColor: "#DCDCDC",
            borderRadius: "15px",

            display: "flex",

            flexDirection: "column",
            fontFamily: "Poppins",
            gap: "5px",
          }}
        >
          <div
            style={{
              display: "flex",

              paddingTop: "10px",
              justifyContent: "center",
              marginTop: "-50px",
            }}
          >
            <img
              style={{
                width: "80px",
                height: "80px",
              }}
              src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/public/Group%2061.png"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            {" "}
            <h3
              style={{
                maxHeight: "1.25em",
                overflow: "hidden",
                textAlign: "center",
              }}
            >
              {rifa.nombre}
            </h3>
          </div>
          <div>
            <p
              style={{
                textAlign: "center",
                padding: "10px",
                fontSize: "13px",
                maxHeight: "7em",
                overflow: "scroll",
              }}
            >
              {rifa.desc}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingLeft: "15px",
              paddingRight: "15px",
            }}
          >
            <LoadingBarRender boletosVendidos={5} rifa={rifa} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p
          style={{
            marginTop: "20px",
            fontSize: "20px",
            color: "white",

            fontWeight: "600",
            backgroundColor: "#007BFF",
            borderRadius: "30px",
            padding: "5px 20px 5px 20px",
          }}
        >
          ${rifa.precioboleto} MXN
        </p>
      </div>
      <hr
        style={{
          marginTop: "20px",
          width: "80px",
          position: "relative",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </>
  );
};

export default RifaListMobile;
