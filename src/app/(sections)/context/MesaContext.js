'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const MesaContext = createContext(null);

export function MesaProvider({ children }) {
  const [mesaId, setMesaId] = useState(null);
  
  // Inicializa desde localStorage cuando el componente se monta
  useEffect(() => {
    const mesaIdGuardada = localStorage.getItem('mesaId');
    
    if (mesaIdGuardada) {
      setMesaId(mesaIdGuardada);
    }
  }, []);
  
  // Actualiza cuando cambia el valor
  const actualizarMesaId = (nuevaMesaId) => {
    setMesaId(nuevaMesaId);
    localStorage.setItem('mesaId', nuevaMesaId || '');
  };
  
  return (
    <MesaContext.Provider value={{ mesaId, actualizarMesaId }}>
      {children}
    </MesaContext.Provider>
  );
}

export function useMesaInfo() {
  const context = useContext(MesaContext);
  if (!context) {
    throw new Error('useTableInfo must be used within a TableProvider');
  }
  return context;
}