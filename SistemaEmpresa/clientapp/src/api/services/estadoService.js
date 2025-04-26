import apiClient from '../client';
import PaisService from './paisService';

// Melhorando a função de normalização
const normalizarDados = (data) => {
  if (!data) return null;
  
  if (Array.isArray(data)) {
    return data.map(item => normalizarDados(item));
  }
  
  if (typeof data !== 'object') return data;
  
  // Cria um novo objeto para armazenar os dados normalizados
  const resultado = {};
  
  // Para cada propriedade no objeto original
  Object.keys(data).forEach(key => {
    // Garante que estamos lidando com a versão em camelCase da chave
    // Converte 'Nome' para 'nome', 'PaisId' para 'paisId', etc.
    const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
    
    // Processa o valor baseado em seu tipo
    if (data[key] === null) {
      resultado[camelCaseKey] = null;
    } else if (Array.isArray(data[key])) {
      resultado[camelCaseKey] = data[key].map(item => 
        typeof item === 'object' && item !== null ? normalizarDados(item) : item
      );
    } else if (typeof data[key] === 'object') {
      resultado[camelCaseKey] = normalizarDados(data[key]);
    } else {
      resultado[camelCaseKey] = data[key];
    }
  });
  
  return resultado;
};

// Função para preparar dados para envio à API
const prepareDadosParaAPI = (data) => {
  if (!data) return null;
  
  const resultado = {};
  Object.keys(data).forEach(key => {
    // Converte para PascalCase para a API .NET
    const newKey = key.charAt(0).toUpperCase() + key.slice(1);
    resultado[newKey] = data[key];
  });
  
  return resultado;
};

// Método que normaliza os dados dos estados
const normalizeData = (data, paises) => {
  console.log('Dados brutos recebidos da API:', data);
  
  return data.map(estado => {
    // Encontrar o país correspondente pelo ID
    const paisCorrespondente = paises.find(p => p.id === estado.paisId);
    
    return {
      id: estado.id,
      nome: estado.nome,
      uf: estado.uf,
      paisId: estado.paisId,
      // Usar o nome do país encontrado ou 'N/A' se não encontrar
      paisNome: paisCorrespondente ? paisCorrespondente.nome : 'N/A'
    };
  });
};

const EstadoService = {
  // Modificar o método getAll
  getAll: async (paisId = null) => {
    try {
      // Primeiro, buscar todos os países para ter os dados disponíveis
      const paises = await PaisService.getAll();
      console.log("Paises disponíveis:", paises);
      
      // Se um paisId for especificado, filtra por país, senão busca todos
      const url = paisId ? `/api/Estado/porPais/${paisId}` : '/api/Estado';
      console.log(`Buscando estados ${paisId ? 'do país '+paisId : 'de todos os países'}`);
      
      const response = await apiClient.get(url);
      console.log("Dados brutos recebidos da API:", response.data);
      
      // Associar o nome do país a cada estado usando a lista de países
      const dadosNormalizados = Array.isArray(response.data) 
        ? response.data.map(estado => {
            // Procurar o país correspondente pelo ID
            const paisCorrespondente = paises.find(p => p.id === estado.paisId);
            
            return {
              id: estado.Id || estado.id,
              nome: estado.Nome || estado.nome,
              uf: estado.UF || estado.Uf || estado.uf,
              paisId: estado.PaisId || estado.paisId,
              // Usar o nome do país encontrado
              paisNome: paisCorrespondente ? paisCorrespondente.nome : 'N/A'
            };
          })
        : [];
      
      console.log("Dados normalizados COM nomes de países:", dadosNormalizados);
      return dadosNormalizados;
    } catch (error) {
      console.error("Erro ao obter estados:", error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      console.log(`Buscando estado com ID ${id}`);
      const response = await apiClient.get(`/api/Estado/${id}`);
      console.log("Resposta da API:", response.data);
      
      // Normalizar os dados
      const dadosNormalizados = {
        id: response.data.Id || response.data.id,
        nome: response.data.Nome || response.data.nome,
        uf: response.data.UF || response.data.Uf || response.data.uf,
        paisId: response.data.PaisId || response.data.paisId
      };
      
      return dadosNormalizados;
    } catch (error) {
      console.error(`Erro ao buscar estado ${id}:`, error);
      throw error;
    }
  },
  
  getByPaisId: async (paisId) => {
    try {
      console.log(`Chamando API para obter estados do país ${paisId}`);
      const response = await apiClient.get(`/api/Estado/porPais/${paisId}`);
      console.log(`Dados recebidos da API (estados do país ${paisId}):`, response.data);
      const dadosNormalizados = normalizarDados(response.data);
      console.log(`Dados normalizados (estados do país ${paisId}):`, dadosNormalizados);
      return dadosNormalizados;
    } catch (error) {
      console.error(`Erro ao obter estados do país ${paisId}:`, error);
      throw error;
    }
  },
  
  create: async (estadoData) => {
    try {
      console.log("Dados a serem enviados para criação de estado:", estadoData);
      const dadosParaAPI = prepareDadosParaAPI(estadoData);
      console.log("Dados preparados para API (create estado):", dadosParaAPI);
      const response = await apiClient.post('/api/Estado', dadosParaAPI);
      return normalizarDados(response.data);
    } catch (error) {
      console.error("Erro ao criar estado:", error);
      throw error;
    }
  },
  
  update: async (id, estadoData) => {
    try {
      console.log(`Dados a serem enviados para atualização de estado (ID ${id}):`, estadoData);
      const dadosParaAPI = prepareDadosParaAPI(estadoData);
      console.log(`Dados preparados para API (update estado ID ${id}):`, dadosParaAPI);
      const response = await apiClient.put(`/api/Estado/${id}`, dadosParaAPI);
      return normalizarDados(response.data);
    } catch (error) {
      console.error(`Erro ao atualizar estado ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      await apiClient.delete(`/api/Estado/${id}`);
      console.log(`Estado com ID ${id} excluído com sucesso`);
    } catch (error) {
      console.error(`Erro ao excluir estado ${id}:`, error);
      throw error;
    }
  }
};

export default EstadoService;