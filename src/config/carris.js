const parseHeaders = () => {
  const rawHeaders = import.meta.env.VITE_CARRIS_API_HEADERS;

  if (!rawHeaders) {
    const headers = {};

    if (import.meta.env.VITE_CARRIS_API_TOKEN) {
      headers.Authorization = `Bearer ${import.meta.env.VITE_CARRIS_API_TOKEN}`;
    }

    if (import.meta.env.VITE_CARRIS_API_KEY) {
      headers['x-api-key'] = import.meta.env.VITE_CARRIS_API_KEY;
    }

    return headers;
  }

  try {
    const parsed = JSON.parse(rawHeaders);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.warn('Não foi possível interpretar VITE_CARRIS_API_HEADERS como JSON.', error);
  }

  return {};
};

export const carris12EConfig = {
  enabled: import.meta.env.VITE_CARRIS_12E_ENABLED !== 'false',
  realtimeUrl: import.meta.env.VITE_CARRIS_12E_REALTIME_URL || '',
  headers: parseHeaders(),
};

export default carris12EConfig;