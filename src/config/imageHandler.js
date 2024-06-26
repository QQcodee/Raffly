// src/services/supabaseService.js
import supabase from "./supabaseClient";

export const uploadImage = async (file) => {
  const filePath = `public/${file.name}`;
  const { data, error } = await supabase.storage
    .from("imagenes-rifas")
    .upload(filePath, file);

  if (error && error.message === "The resource already exists") {
    const { data: publicURLData, error: publicURLError } = supabase.storage
      .from("imagenes-rifas")
      .getPublicUrl(filePath);

    if (publicURLError) {
      throw publicURLError;
    }

    return { filePath, publicURL: publicURLData.publicUrl, exists: true };
  }

  if (error) {
    throw error;
  }

  const { data: publicURLData, error: publicURLError } = supabase.storage
    .from("imagenes-rifas")
    .getPublicUrl(filePath);

  if (publicURLError) {
    throw publicURLError;
  }

  return { filePath, publicURL: publicURLData.publicUrl, exists: false };
};

export const deleteImage = async (filePath) => {
  const { data, error } = await supabase.storage
    .from("imagenes-rifas")
    .remove([filePath]);

  if (error) {
    throw error;
  }

  return data;
};
