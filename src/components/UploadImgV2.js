import supabase from "../config/supabaseClient";
import { useState, useRef } from "react";
import { useUser } from "../UserContext";
import { useEffect } from "react";

import "./UploadImgV2.css";

const UploadImgV2 = ({ onGalleryUpdate }) => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [imagenesGaleria, setImagenesGaleria] = useState([]);
  const [imagenPrincipal, setImagenPrincipal] = useState("");

  const { user } = useUser();

  const [showPopup, setShowPopup] = useState(false);

  const fileInputRef = useRef(null);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length > 0) {
      setFiles(validFiles);
      setUploadStatus([]);
    } else {
      setFiles([]);
      setUploadStatus([
        "Solo se pueden subir imagenes de tipo (jpg, jpeg, png).",
      ]);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadStatus(["Por favor, selecciona archivos."]);
      return;
    }

    setIsUploading(true);
    const statuses = [];

    for (const file of files) {
      const filePath = `${user.id}/${file.name}`;

      const { data, error } = await supabase.storage
        .from("ImageManager")
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading file:", error.message);
        statuses.push(`Error al subir ${file.name}: ${error.message}`);
      } else {
        console.log("File uploaded successfully:", data);
        statuses.push(`Archivo subido correctamente: ${file.name}`);
      }
    }

    setIsUploading(false);
    setUploadStatus(statuses);
    setFiles([]);
  };

  const ImageManager = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedImages, setSelectedImages] = useState([]);

    const { user } = useUser();

    useEffect(() => {
      const fetchImages = async () => {
        try {
          if (!user) {
            setError("User not logged in.");
            setLoading(false);
            return;
          }

          // List objects in the bucket
          const { data: files, error: listError } = await supabase.storage
            .from("ImageManager") // Replace with your bucket name
            .list(user.id, {
              limit: 100,

              sortBy: { column: "created_at", order: "desc" },
            });

          const filteredFiles = files.filter(
            (file) => file.name !== ".emptyFolderPlaceholder"
          );

          if (listError) {
            console.error("Error fetching images:", listError.message);
            setError(listError.message);
            setLoading(false);
            return;
          }

          if (!files || files.length === 0) {
            setLoading(false);
            return;
          }

          // Define expiration time for 1 year in seconds
          const expirationTimeInSeconds = 365 * 24 * 3600; // 1 year

          // Generate signed URLs for each file
          const imageUrls = await Promise.all(
            filteredFiles.map(async (file) => {
              try {
                const { data, error: urlError } = await supabase.storage
                  .from("ImageManager")
                  .createSignedUrl(
                    `${user.id}/${file.name}`,
                    expirationTimeInSeconds
                  );

                if (urlError) {
                  console.error(
                    `Error creating signed URL for ${file.name}:`,
                    urlError.message
                  );
                  return null;
                }

                return data.signedUrl;
              } catch (err) {
                console.error(
                  `Unexpected error for ${file.name}:`,
                  err.message
                );
                return null;
              }
            })
          );

          // Filter out any null values (in case of errors)
          setImages(imageUrls.filter((url) => url !== null));
        } catch (error) {
          console.error("Unexpected error:", error);
          setError(error.message || "Error fetching images.");
        } finally {
          setLoading(false);
        }
      };

      fetchImages();
    }, [user]);

    const handleImageClick = (url) => {
      setSelectedImages((prevSelected) => {
        if (prevSelected.includes(url)) {
          // Remove from selected
          return prevSelected.filter((imageUrl) => imageUrl !== url);
        } else {
          // Add to selected
          return [...prevSelected, url];
        }
      });
    };

    if (loading) return <p>Cargando imagenes...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: "20px", fontFamily: "poppins" }}>
            Tus Imagenes
          </p>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",

              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={handleClick}
              style={{
                background: "white",
                border: "1px solid #6FCF85",
                cursor: "pointer",
                padding: "10px",
                borderRadius: "15px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",

                display: "flex",
                justifyContent: "center",

                alignItems: "center",

                width: "50px",

                height: "50px",
              }}
            >
              <i
                className="material-icons"
                style={{ fontSize: "24px", color: "#6FCF85" }}
              >
                {" "}
                add_a_photo
              </i>
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {files.length > 0 && (
            <button
              style={{
                cursor: "pointer",
                fontFamily: "poppins",
                fontSize: "14px",
                padding: "10px",
                backgroundColor: "#007BFF",
                height: "40px",
              }}
              onClick={() => handleUpload()}
              disabled={isUploading}
            >
              {isUploading ? "Cargando..." : "Subir Imagenes"}
            </button>
          )}
        </div>

        <hr />

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {selectedImages
            ? selectedImages.length > 0 && (
                <button
                  onClick={() => {
                    setImagenesGaleria(selectedImages);
                    togglePopup();
                  }}
                  style={{
                    cursor: "pointer",
                    fontFamily: "poppins",
                    fontSize: "14px",
                    padding: "10px",
                    backgroundColor: "#007BFF",
                    height: "40px",
                  }}
                >
                  Agregar Seleccionado a galeria
                </button>
              )
            : null}
        </div>
        <div className="imagenes-subidas">
          {images.length > 0 ? (
            images.map((url, index) => (
              <div
                key={index}
                onClick={() => handleImageClick(url)}
                style={{
                  height: "90px",
                  width: "90px",
                  border: "none",
                  boxShadow: selectedImages
                    ? selectedImages.includes(url)
                      ? "0 0 10px rgba(111, 207, 133, 0.5)"
                      : "none"
                    : "none",
                  overflow: "hidden",
                  borderRadius: "5px",
                  cursor: "pointer",
                  border: selectedImages
                    ? selectedImages.includes(url)
                      ? "1px solid #6FCF85"
                      : "none"
                    : "none",
                }}
              >
                <img
                  src={url}
                  alt={`User file ${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: selectedImages
                      ? selectedImages.includes(url)
                        ? "brightness(80%)"
                        : "none"
                      : "none",
                  }}
                />
              </div>
            ))
          ) : (
            <p>No images found.</p>
          )}
        </div>
      </div>
    );
  };

  const Popup = ({ handleClose, show, children }) => {
    return (
      <div className={`popup ${show ? "show" : ""}`}>
        <div className="popup-inner">
          <p
            style={{ fontSize: "20px", fontFamily: "poppins" }}
            className="close-btn"
            onClick={handleClose}
          >
            <i className="material-icons">close</i>
          </p>
          {children}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (onGalleryUpdate) {
      onGalleryUpdate(imagenesGaleria); // Call the callback prop
    }
  }, [imagenesGaleria]);

  return (
    <div>
      <Popup show={showPopup} handleClose={togglePopup}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <h3>Imagenes</h3>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {user && <ImageManager />}
      </Popup>
      <button
        type="button"
        style={{
          cursor: "pointer",
          fontFamily: "poppins",
          fontSize: "14px",
          padding: "10px",
          backgroundColor: "#007BFF",
          height: "40px",
        }}
        onClick={() => togglePopup()}
      >
        Agregar Imagenes a Galeria
      </button>{" "}
    </div>
  );
};

export default UploadImgV2;

/*

  <div style={{ display: "flex", gap: "10px" }}>
        {imagenesGaleria.length > 0 &&
          imagenesGaleria.map((url, index) => (
            <img
              style={{ height: "100px", width: "100px" }}
              key={index}
              src={url}
              alt={`User file ${index}`}
            />
          ))}

        {imagenPrincipal.length > 0 &&
          imagenPrincipal.map((url, index) => (
            <img
              style={{ height: "100px", width: "100px" }}
              key={index}
              src={url}
              alt={`User file ${index}`}
            />
          ))}
      </div>

      */
