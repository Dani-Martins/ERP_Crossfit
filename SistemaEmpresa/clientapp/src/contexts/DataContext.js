import React, { createContext, useState, useContext, useCallback } from 'react';

// Criar o contexto
export const DataContext = createContext();

// Hook para facilitar o uso do contexto
export const useDataContext = () => useContext(DataContext);

// Provedor de dados
export const DataProvider = ({ children }) => {
  // Estado para controlar atualizações
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Função para forçar atualização de todos os dados
  const refreshAll = useCallback(() => {
    console.log('Atualizando todos os dados');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Disponibilizar valores pelo contexto
  const value = {
    refreshTrigger,
    refreshAll,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};