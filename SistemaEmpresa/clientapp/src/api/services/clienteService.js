import apiClient from '../client';

export const ClienteService = {
  getAll: async () => {
    const response = await apiClient.get('/Cliente');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/Cliente/${id}`);
    return response.data;
  },
  
  create: async (cliente) => {
    const response = await apiClient.post('/Cliente', cliente);
    return response.data;
  },
  
  update: async (id, cliente) => {
    const response = await apiClient.put(`/Cliente/${id}`, cliente);
    return response.data;
  },
  
  delete: async (id) => {
    await apiClient.delete(`/Cliente/${id}`);
  }
};

export default ClienteService;