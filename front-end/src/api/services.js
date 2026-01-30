// api/services.js
import { api } from './api';

export const fetchAllServices = async () => {
  const { data } = await api.get('/api/services');
  return data?.data || [];
};

export const fetchServiceById = async (id) => {
  const { data } = await api.get(`/api/services/${id}`);
  return data?.data;
};

export const createService = async (serviceData) => {
  const { data } = await api.post('/api/services', serviceData);
  return data?.data;
};

export const updateService = async (id, serviceData) => {
  const { data } = await api.put(`/api/services/${id}`, serviceData);
  return data?.data;
};

export const deleteService = async (id) => {
  const { data } = await api.delete(`/api/services/${id}`);
  return data?.data;
};