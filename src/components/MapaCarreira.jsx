import React from 'react';

const MapaCarreira = ({ carreira, veiculos }) => {
  // Coordenadas simuladas para as carreiras de Lisboa
  const coordenadasCarreiras = {
    '12E': {
      centro: { lat: 38.7136, lng: -9.1353 },
      pontos: [
        { nome: 'Martim Moniz', lat: 38.7158, lng: -9.1353 },
        { nome: 'Socorro', lat: 38.7145, lng: -9.1335 },
        { nome: 'Limoeiro', lat: 38.7130, lng: -9.1310 },
        { nome: 'Sé', lat: 38.7100, lng: -9.1330 },
        { nome: 'Chiado', lat: 38.7108, lng: -9.1420 },
        { nome: 'Pç. Luís Camões', lat: 38.7110, lng: -9.1440 }
      ]
    },
    '15E': {
      centro: { lat: 38.7223, lng: -9.1393 },
      pontos: [
        { nome: 'Praça da Figueira', lat: 38.7140, lng: -9.1380 },
        { nome: 'Cais do Sodré', lat: 38.7065, lng: -9.1445 },
        { nome: 'Belém', lat: 38.6977, lng: -9.2062 },
        { nome: 'Algés', lat: 38.7020, lng: -9.2300 }
      ]
    },
    '18E': {
      centro: { lat: 38.7150, lng: -9.1500 },
      pontos: [
        { nome: 'Ajuda', lat: 38.7050, lng: -9.1950 },
        { nome: 'Estrela', lat: 38.7145, lng: -9.1605 },
        { nome: 'Chiado', lat: 38.7108, lng: -9.1420 },
        { nome: 'Graça', lat: 38.7180, lng: -9.1290 },
        { nome: 'Senhora do Monte', lat: 38.7200, lng: -9.1270 }
      ]
    },
    '24E': {
      centro: { lat: 38.7250, lng: -9.1550 },
      pontos: [
        { nome: 'Campolide', lat: 38.7320, lng: -9.1650 },
        { nome: 'Rato', lat: 38.7200, lng: -9.1550 },
        { nome: 'Chiado', lat: 38.7108, lng: -9.1420 },
        { nome: 'Terreiro do Paço', lat: 38.7075, lng: -9.1365 },
        { nome: 'Graça', lat: 38.7180, lng: -9.1290 }
      ]
    },
    '25E': {
      centro: { lat: 38.7120, lng: -9.1500 },
      pontos: [
        { nome: 'Prazeres', lat: 38.7145, lng: -9.1720 },
        { nome: 'Estrela', lat: 38.7145, lng: -9.1605 },
        { nome: 'Chiado', lat: 38.7108, lng: -9.1420 },
        { nome: 'Terreiro do Paço', lat: 38.7075, lng: -9.1365 },
        { nome: 'Cais do Sodré', lat: 38.7065, lng: -9.1445 }
      ]
    },
    '28E': {
      centro: { lat: 38.7150, lng: -9.1400 },
      pontos: [
        { nome: 'Martim Moniz', lat: 38.7158, lng: -9.1353 },
        { nome: 'Graça', lat: 38.7180, lng: -9.1290 },
        { nome: 'Alfama', lat: 38.7120, lng: -9.1280 },
        { nome: 'Estrela', lat: 38.7145, lng: -9.1605 },
        { nome: 'Prazeres', lat: 38.7145, lng: -9.1720 }
      ]
    }
  };

  const dadosCarreira = coordenadasCarreiras[carreira] || coordenadasCarreiras['28E'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Mapa da Carreira {carreira}</h2>
      
      {/* Mapa visual simplificado */}
      <div className="relative bg-blue-50 rounded-lg p-4 h-64 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">🗺️</div>
            <p className="text-sm text-gray-600 font-medium">Mapa da Carreira {carreira}</p>
            <p className="text-xs text-gray-500 mt-2">
              Visualização dos percursos e localização dos elétricos
            </p>
          </div>
        </div>
        
        {/* Indicadores de veículos ativos */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm p-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700">
              {veiculos?.length || 0} elétricos ativos
            </span>
          </div>
        </div>
        
        {/* Legenda de paragens */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-sm p-3">
          <p className="text-xs font-semibold text-gray-700 mb-2">Paragens principais:</p>
          <div className="space-y-1">
            {dadosCarreira.pontos.slice(0, 3).map((ponto, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-gray-600">{ponto.nome}</span>
              </div>
            ))}
            {dadosCarreira.pontos.length > 3 && (
              <p className="text-xs text-gray-500 italic">
                +{dadosCarreira.pontos.length - 3} paragens
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Informação adicional */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          ℹ️ <strong>Nota:</strong> A localização em tempo real dos elétricos está disponível na visualização de percurso acima. 
          Os círculos coloridos indicam a posição atual de cada veículo nas paragens.
        </p>
      </div>
      
      {/* Botão para mapa completo (futuro) */}
      <div className="mt-4">
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          onClick={() => alert('Funcionalidade de mapa interativo em desenvolvimento. Em breve será possível visualizar o percurso completo num mapa interativo.')}
        >
          🗺️ Ver Mapa Interativo Completo
        </button>
      </div>
    </div>
  );
};

export default MapaCarreira;
