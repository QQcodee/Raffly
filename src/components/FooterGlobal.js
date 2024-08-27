const FooterGlobal = () => {
  return (
    <>
      <footer
        style={{
          textAlign: "center",

          backgroundColor: "#f5f5f5",
          height: "155 px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage:
            "url(https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/pattern_footer.png)",
          backgroundRepeat: "repeat",
          marginTop: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          padding: "20px",
        }}
        className="footer"
      >
        <div
          style={{
            display: "flex",

            justifyContent: "center",
            alignItems: "flex-start",
            gap: "30px",
          }}
        >
          <div
            className="socials-footer"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2
              style={{
                textAlign: "left",
                fontFamily: "Poppins",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              Raffly.com.mx
            </h2>
            <div
              className="social-icons"
              style={{ display: "flex", flexDirection: "row", gap: "10px" }}
            >
              <a>
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/facebook.png"
                  alt="logo"
                  style={{
                    width: "25px",
                    margin: "auto",

                    cursor: "pointer",
                  }}
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/profile.php?id=61561928014396",
                      "_blank"
                    )
                  }
                />
              </a>
              <a>
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/instagram.png"
                  alt="logo"
                  style={{
                    width: "25px",
                    margin: "auto",

                    cursor: "pointer",
                  }}
                  onClick={() =>
                    window.open("https://www.instagram.com/raffly_mx", "_blank")
                  }
                />
              </a>
              <a>
                <img
                  onClick={() =>
                    window.open(
                      "https://api.whatsapp.com/send/?phone=" +
                        "+526143035198" +
                        "&text=Hola tengo una duda de Raffly.com.mx"
                    )
                  }
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/whatsapp.png"
                  alt="logo"
                  style={{
                    width: "25px",
                    margin: "auto",

                    cursor: "pointer",
                  }}
                />
              </a>
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column" }}
            className="contact-footer"
          >
            <h2
              style={{
                textAlign: "left",
                fontFamily: "Poppins",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                color: "black",
              }}
            >
              Contactanos
            </h2>
            <h3 style={{ textAlign: "left", fontSize: "11px", color: "black" }}>
              Email: enrique@raffly.com.mx
            </h3>

            <h3 style={{ textAlign: "left", fontSize: "11px", color: "black" }}>
              Tel. +52 614 303 5198
            </h3>
          </div>
        </div>
      </footer>
      <p
        style={{
          color: "black",
          fontWeight: "500",
          fontSize: "13px",
          textAlign: "center",
          fontFamily: "Poppins",
          marginTop: "20px",
          cursor: "pointer",
          textDecoration: "underline",
        }}
        onClick={() =>
          window.open("https://www.raffly.com.mx/aviso-de-privacidad", "_blank")
        }
      >
        Aviso de privacidad
      </p>
      <p
        style={{
          color: "black",
          fontWeight: "600",
          fontSize: "17px",
          textAlign: "center",
          fontFamily: "Poppins",
          marginTop: "20px",
          cursor: "pointer",
        }}
        onClick={() => window.open("https://www.raffly.com.mx", "_blank")}
      >
        Desarrollado por Raffly.com
      </p>
    </>
  );
};

export default FooterGlobal;
