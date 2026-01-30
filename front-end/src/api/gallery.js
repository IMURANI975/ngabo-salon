// api/gallery.js
import { api } from './api';

export const fetchAllGalleryImages = async () => {
  try {
    const { data } = await api.get('/api/gallery');
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw error;
  }
};

export const uploadGalleryImage = async (formData) => {
  try {
    const { data } = await api.post('/api/gallery', formData);
    return data?.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteGalleryImage = async (id) => {
  try {
    const { data } = await api.delete(`/api/gallery/${id}`);
    return data?.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const fetchGalleryImageById = async (id) => {
  try {
    const { data } = await api.get(`/api/gallery/${id}`);
    return data?.data;
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    throw error;
  }
};