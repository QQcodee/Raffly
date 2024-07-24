import "./SlotMachine.css";

const SlotMachine = ({ columnas }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
          height: "235px",
          width: columnas ? `${columnas * 85}px` : "auto",

          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",

          marginBottom: "60px",
          overflow: "hidden",
        }}
      >
        {columnas === 5 && (
          <>
            <div className="slot-column">
              <div className="slot-content-1">
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
              </div>
            </div>
            <div className="slot-column">
              <div className="slot-content-2">
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
              </div>
            </div>
            <div className="slot-column">
              <div className="slot-content-3">
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
              </div>
            </div>
            <div className="slot-column">
              <div className="slot-content-2">
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
              </div>
            </div>
            <div className="slot-column">
              <div className="slot-content-3">
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
              </div>
            </div>
          </>
        )}

        {columnas === 3 && (
          <>
            <div className="slot-column">
              <div className="slot-content-1">
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
              </div>
            </div>

            <div className="slot-column">
              <div className="slot-content-3">
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
              </div>
            </div>

            <div className="slot-column">
              <div className="slot-content-2">
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
                <img
                  src="https://ivltiudjxnrytalzxfwr.supabase.co/storage/v1/object/public/imagenes-rifas/No-borrar/slotreel.png"
                  alt="Slot Image"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SlotMachine;
