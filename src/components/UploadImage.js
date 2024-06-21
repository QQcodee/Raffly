import supabase from "../config/supabaseClient";
import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import Carousel from "./Carousel";

const UploadImage = () => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [socioMetaData, setSocioMetaData] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [arrayImagenes, setArrayImagenes] = useState([]);
  //const rifa = "5e087aad-06ad-4ae4-9aaf-477f9fdf9209";

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
      } 
      catch (error) {
        console.error("Error uploading image:", error.message);
      }
    });

    await Promise.all(uploadPromises);
    setImagePreviews((prev) => [...prev, ...newImagePreviews]);
    addItems(newImageURLs);
    setImages((prev) => [...prev, ...newImageURLs]);
  };

  const handleSelectImage = (url) => {
    setSelectedImages((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]
    );
  };

  const handleDeleteImages = async () => {
    const deletePromises = selectedImages.map(async (url) => {
      const fileName = url.split('/').pop(); // Extract the file name from the URL
      const { data, error } = await supabase.storage
        .from("imagenes-rifas")
        .remove([`public/${fileName}`]);

      if (error) {
        console.error("Error deleting image:", error.message);
      }
    });

    await Promise.all(deletePromises);
    setItems((prev) => prev.filter((item) => !selectedImages.includes(item)));
    setImagePreviews((prev) => prev.filter((item) => !selectedImages.includes(item)));
    setImages((prev) => prev.filter((item) => !selectedImages.includes(item)));
    setSelectedImages([]);
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
      <button onClick={handleDeleteImages} disabled={selectedImages.length === 0}>
        Delete Selected Images
      </button>
      <div className="image-gallery">
        {items.map((url, index) => (
          <div key={index} className="image-item">
            <input
              type="checkbox"
              checked={selectedImages.includes(url)}
              onChange={() => handleSelectImage(url)}
            />
            <img src={url} alt={`Preview ${index}`} style={{ width: '100px', height: '100px' }} />
          </div>
        ))}
      </div>
      {imagePreviews.length > 0 ? (
        <Carousel images={items} />
      ) : null}
    </>
  );
};


export default UploadImage;
