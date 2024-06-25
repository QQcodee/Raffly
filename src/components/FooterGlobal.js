const FooterGlobal = () => {
  return (
    <footer
      style={{
        textAlign: "center",

        backgroundColor: "#f5f5f5",
        height: "60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "url(https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/Footer.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        marginTop: "20px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
      }}
      className="footer"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
      </div>
    </footer>
  );
};

export default FooterGlobal;
