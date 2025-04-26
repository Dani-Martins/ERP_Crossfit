import apiClient from '../client';

export const FormaPagamentoService = {
  getAll: async () => {
    const response = await apiClient.get('/FormaPagamento');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/FormaPagamento/${id}`);
    return response.data;
  },
  
  create: async (formaPagamento) => {
    const response = await apiClient.post('/FormaPagamento', formaPagamento);
    return response.data;
  },
  
  update: async (id, formaPagamento) => {
    const response = await apiClient.put(`/FormaPagamento/${id}`, formaPagamento);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/FormaPagamento/${id}`);
    return response.data;
  },
  
  getAllAtivos: async () => {
    const response = await apiClient.get('/FormaPagamento/ativos');
    return response.data;
  }
};

export default FormaPagamentoService;