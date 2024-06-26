// src/components/UploadImage.js
import { useState } from "react";
import { uploadImage, deleteImage } from "../config/imageHandler";
import ImageGrid from "./ImageGrid";
import React from "react";

import ImageGallery from "react-image-gallery";


const UploadImage = () => {
  const [images, setImages] = useState([]);

  const handleImageUpload = async (files) => {
    try {
      const uploadedImages = [];
  
      for (const file of files) {
        const originalPath = `public/original/${file.name}`;
        const thumbnailPath = `public/thumbnail/${file.name}`;
  
        // Check if the image is already uploaded and exists in the state
        if (images.some(image => image.original === originalPath && image.thumbnail === thumbnailPath)) {
          console.log(`File ${file.name} is already uploaded.`);
          continue;
        }
  
        const result = await uploadImage(file);
        if (result.exists) {
          console.log(`File ${file.name} already exists. Using existing file.`);
        }
  
        // Assuming uploadImage returns an object { original: URL, thumbnail: URL }
        uploadedImages.push({
          original: result.original,
          thumbnail: result.thumbnail
        });
      }
  
      // Update the state with new images
      setImages(prev => [...prev, ...uploadedImages]);
    } catch (error) {
      console.error("Error uploading images:", error.message);
    }
  };
  

class MyGallery extends React.Component {
  render() {
    return <ImageGallery items={images}/>;
  }
}

  const handleImageDelete = async (filePath) => {
    try {
      await deleteImage(filePath);
      setImages((prev) => prev.filter((image) => image.filePath !== filePath));
    } catch (error) {
      console.error("Error deleting image:", error.message);
    }
  };

  return (
    <div>
      <h1>
        <label htmlFor="images">Imagenes:</label>
        <input
          type="file"
          id="images"
          accept="image/*"
          multiple
          onChange={(e) => handleImageUpload(e.target.files)}
        />
      </h1>

      <ImageGrid images={images} onDelete={handleImageDelete} />
      <MyGallery />
    </div>
  );
};

export default UploadImage;
