import apiClient from '../client';

const CidadeService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/api/Cidade');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Cidade/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar cidade ${id}:`, error);
      throw error;
    }
  },
  
  create: async (cidade) => {
    try {
      const response = await apiClient.post('/api/Cidade', cidade);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cidade:', error);
      throw error;
    }
  },
  
  update: async (id, cidade) => {
    try {
      const response = await apiClient.put(`/api/Cidade/${id}`, cidade);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar cidade ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      await apiClient.delete(`/api/Cidade/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir cidade ${id}:`, error);
      throw error;
    }
  },

  // Método adicional para obter cidades por estado
  getByEstado: async (estadoId) => {
    const response = await apiClient.get(`/Cidade/porestado/${estadoId}`);
    return response.data;
  }
};

export default CidadeService;