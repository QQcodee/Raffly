import supabase from "../config/supabaseClient";
import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";

//import UploadImage.css
//import "../css/UploadImage.css";
import "../css/UploadImage.css";

const UploadImage = ({ onUploadComplete }) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [socioMetaData, setSocioMetaData] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [arrayImagenes, setArrayImagenes] = useState([]);
  //const rifa = "5e087aad-06ad-4ae4-9aaf-477f9fdf9209";

  const [galeria, setGaleria] = useState([]);

  // Function to append new items to the array
  const addItems = (newItems) => {
    setItems((prevItems) => [...prevItems, ...newItems]);
  };

  const handleImageUpload = async (files) => {
    const newImagePreviews = [];
    const newImageURLs = [];
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const existingImage = items.find((item) => item.includes(file.name));

        if (existingImage) {
          newImagePreviews.push(existingImage);
          newImageURLs.push(existingImage);
        } else {
          const filePath = `public/${file.name}`;
          const { data, error } = await supabase.storage
            .from("imagenes-rifas")
            .upload(filePath, file);
        }

        const filePath = `public/${file.name}`;

        // Retrieve the public URL for the uploaded image
        const { data: publicURLData, error: publicURLError } = supabase.storage
          .from("imagenes-rifas")
          .getPublicUrl(filePath);

        if (publicURLError) {
          throw publicURLError;
        }

        const publicURL = publicURLData.publicUrl;
        newImagePreviews.push(publicURL);
        newImageURLs.push(publicURL);
        setGaleria(newImageURLs);
        console.log(galeria);
      } catch (error) {
        console.error("Error uploading image:", error.message);
      }
    });

    await Promise.all(uploadPromises);
    setImagePreviews((prev) => [...prev, ...newImagePreviews]);
    addItems(newImageURLs);
    setImages((prev) => [...prev, ...newImageURLs]);

    if (onUploadComplete) {
      onUploadComplete(newImageURLs);
    }
  };

  const handleDeleteImagen = (url) => {
    const updatedImages = images.filter((imageUrl) => imageUrl !== url);
    setGaleria(updatedImages);
    setItems(updatedImages);
    setImagePreviews(updatedImages);
    setImages(updatedImages);

    if (onUploadComplete) {
      onUploadComplete(updatedImages);
    }
  };
  return (
    <>
      <h1>
        <div style={{ padding: "20px", width: "100%" }}>
          <label
            style={{ fontSize: "16px", fontWeight: "400" }}
            htmlFor="images"
          >
            Imágenes:
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
            style={{
              width: "100%",
              color: "black",
              padding: "10px",

              borderRadius: "15px",
              border: "1px solid #ccc",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />
        </div>
      </h1>

      <div className="image-gallery">
        {items.map((url, index) => (
          <div
            style={{ display: "inline-block" }}
            key={index}
            className="image-item"
            url={url}
          >
            <img
              src={url}
              alt={url}
              style={{ width: "100px", height: "100px" }}
            />

            <button
              onClick={() => handleDeleteImagen(url)}
              className="delete-button"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default UploadImage;
