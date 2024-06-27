import supabase from "../config/supabaseClient";
import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";

//import UploadImage.css
//import "../css/UploadImage.css";

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

  const handleDeleteImages = async (url) => {
    try {
      // Extract the file path from the URL
      const filePath = new URL(url).pathname;

      // Adjust the file path to match the bucket structure
      const bucketPathPrefix = "/storage/v1/object/public/imagenes-rifas/";
      if (!filePath.startsWith(bucketPathPrefix)) {
        console.error("Invalid URL format");
        return;
      }
      const adjustedFilePath = filePath.replace(bucketPathPrefix, "");

      console.log("Extracted file path:", adjustedFilePath);

      if (!adjustedFilePath) {
        console.error("File path is empty or undefined");
        return;
      }

      const { data, error } = await supabase.storage
        .from("imagenes-rifas")
        .remove([url]);

      if (error) {
        console.error("Error deleting image:", error.message);
      } else {
        console.log("Image deleted successfully", data);
      }
    } catch (error) {
      console.error("Error processing the URL:", error.message);
    }
  };

  return (
    <>
      <h1>
        <div>
          <label htmlFor="images">Imágenes:</label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
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
          </div>
        ))}
      </div>
    </>
  );
};

export default UploadImage;
