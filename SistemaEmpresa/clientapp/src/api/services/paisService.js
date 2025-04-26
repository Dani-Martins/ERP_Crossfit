import apiClient from '../client';

// Função simplificada que funciona tanto para dados da API quanto para envio
const normalizarDados = (data) => {
  if (!data) return null;
  
  if (Array.isArray(data)) {
    return data.map(item => normalizarDados(item));
  }
  
  if (typeof data !== 'object') return data;
  
  const resultado = {};
  Object.keys(data).forEach(key => {
    // Independente de ser PascalCase ou camelCase, normaliza para camelCase
    const newKey = key.charAt(0).toLowerCase() + key.slice(1);
    
    if (data[key] === null) {
      resultado[newKey] = null;
    } else if (Array.isArray(data[key])) {
      resultado[newKey] = data[key].map(item => 
        typeof item === 'object' && item !== null ? normalizarDados(item) : item
      );
    } else if (typeof data[key] === 'object') {
      resultado[newKey] = normalizarDados(data[key]);
    } else {
      resultado[newKey] = data[key];
    }
  });

  // Se for um país individual
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    // Garantir que o código não tenha o '+' ao normalizar (para consistência interna)
    if (data.codigo && data.codigo.startsWith('+')) {
      data.codigo = data.codigo.substring(1);
    }
    // ou se for Codigo com C maiúsculo
    if (data.Codigo && data.Codigo.startsWith('+')) {
      data.Codigo = data.Codigo.substring(1);
    }
  }
  
  return resultado;
};

// Função que prepara os dados para o backend (camelCase para PascalCase)
const prepareDadosParaAPI = (data) => {
  if (!data) return null;
  
  const resultado = {};
  Object.keys(data).forEach(key => {
    // Converte para PascalCase (formato esperado pela API .NET)
    const newKey = key.charAt(0).toUpperCase() + key.slice(1);
    resultado[newKey] = data[key];
  });
  
  return resultado;
};

// Ao preparar dados para exibição em tabelas/detalhes
const formatarDadosPaisParaExibicao = (pais) => {
  return {
    ...pais,
    // Adicionar o '+' apenas para exibição
    codigoFormatado: pais.codigo ? `+${pais.codigo}` : ''
  };
};

const PaisService = {
  getAll: async () => {
    try {
      console.log("Chamando API para obter todos os países");
      const response = await apiClient.get('/api/Pais');
      console.log("Dados recebidos da API (getAll):", response.data);
      const dadosNormalizados = normalizarDados(response.data);
      console.log("Dados normalizados (getAll):", dadosNormalizados);
      return dadosNormalizados;
    } catch (error) {
      console.error("Erro ao obter países:", error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      console.log(`Chamando API para obter país com ID ${id}`);
      const response = await apiClient.get(`/api/Pais/${id}`);
      console.log(`Dados recebidos da API (getById ${id}):`, response.data);
      const dadosNormalizados = normalizarDados(response.data);
      console.log(`Dados normalizados (getById ${id}):`, dadosNormalizados);
      return dadosNormalizados;
    } catch (error) {
      console.error(`Erro ao obter país ${id}:`, error);
      throw error;
    }
  },
  
  create: async (paisData) => {
    try {
      const response = await apiClient.post('/api/Pais', paisData);
      const novoPais = normalizarDados(response.data);
      
      // Disparar apenas um evento de atualização
      window.dispatchEvent(new CustomEvent('dataChange', { 
        detail: { type: 'pais', action: 'create', data: novoPais } 
      }));
      
      return novoPais;
    } catch (error) {
      console.error('Erro ao criar país:', error);
      throw error;
    }
  },
  
  update: async (id, paisData) => {
    try {
      console.log(`Dados a serem enviados para atualização (ID ${id}):`, paisData);
      const dadosParaAPI = prepareDadosParaAPI(paisData);
      console.log(`Dados preparados para API (update ID ${id}):`, dadosParaAPI);
      const response = await apiClient.put(`/api/Pais/${id}`, dadosParaAPI);
      const paisAtualizado = normalizarDados(response.data);
      
      // Disparar evento de atualização
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('dataChange', { detail: { type: 'pais' }}));
      }
      
      // Notificar sobre mudanças
      window.dispatchEvent(new CustomEvent('dataChange'));
      
      return paisAtualizado;
    } catch (error) {
      console.error(`Erro ao atualizar país ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      await apiClient.delete(`/api/Pais/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir país ${id}:`, error);
      // Propagar o erro para o componente tratar
      throw error;
    }
  }
};

export default PaisService;