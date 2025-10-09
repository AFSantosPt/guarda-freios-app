// Configuração da API
const API_URL = import.meta.env.VITE_API_URL || 'https://guarda-freios-api.up.railway.app';

// Helper para fazer requisições
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================
// AUTENTICAÇÃO
// ============================================

export const login = async (numero, password) => {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ numero, password }),
  });
};

export const changePassword = async (numero, currentPassword, newPassword) => {
  return apiRequest('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ numero, currentPassword, newPassword }),
  });
};

// ============================================
// GPS
// ============================================

export const updateGPS = async (tripulante_id, veiculo_id, carreira_id, latitude, longitude, precisao, velocidade) => {
  return apiRequest('/api/gps/update', {
    method: 'POST',
    body: JSON.stringify({
      tripulante_id,
      veiculo_id,
      carreira_id,
      latitude,
      longitude,
      precisao,
      velocidade,
    }),
  });
};

export const getGPSByCarreira = async (codigo) => {
  return apiRequest(`/api/gps/carreira/${codigo}`);
};

export const stopGPS = async (tripulante_id) => {
  return apiRequest('/api/gps/stop', {
    method: 'POST',
    body: JSON.stringify({ tripulante_id }),
  });
};

// ============================================
// CHECK-INS
// ============================================

export const createCheckin = async (tripulante_id, servico_id, veiculo_id, local, latitude, longitude, tipo = 'Rendição') => {
  return apiRequest('/api/checkins', {
    method: 'POST',
    body: JSON.stringify({
      tripulante_id,
      servico_id,
      veiculo_id,
      local,
      latitude,
      longitude,
      tipo,
    }),
  });
};

export const getCheckinsByCarreira = async (codigo) => {
  return apiRequest(`/api/checkins/carreira/${codigo}`);
};

// ============================================
// HEALTH CHECK
// ============================================

export const healthCheck = async () => {
  return apiRequest('/health');
};

export default {
  login,
  changePassword,
  updateGPS,
  getGPSByCarreira,
  stopGPS,
  createCheckin,
  getCheckinsByCarreira,
  healthCheck,
};

