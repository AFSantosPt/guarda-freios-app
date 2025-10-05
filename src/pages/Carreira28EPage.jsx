import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Carreira28EPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const watchIdRef = useRef(null);
  
  // Dados das paragens da Carreira 28E
  const paragens = [
    {
        "nome": "Martim Moniz",
        "lat": 38.71565,
        "lng": -9.13602,
        "ordem": 1
    },
    {
        "nome": "Graça",
        "lat": 38.71898,
        "lng": -9.12845,
        "ordem": 2
    },
    {
        "nome": "Senhora do Monte",
        "lat": 38.72198,
        "lng": -9.12645,
        "ordem": 3
    },
    {
        "nome": "Graça (descida)",
        "lat": 38.71898,
        "lng": -9.12945,
        "ordem": 4
    },
    {
        "nome": "Baixa",
        "lat": 38.71398,
        "lng": -9.13698,
        "ordem": 5
    },
    {
        "nome": "Chiado",
        "lat": 38.71098,
        "lng": -9.14145,
        "ordem": 6
    },
    {
        "nome": "Camões",
        "lat": 38.71045,
        "lng": -9.14345,
        "ordem": 7
    },
    {
        "nome": "Estrela",
        "lat": 38.71398,
        "lng": -9.15845,
        "ordem": 8
    },
    {
        "nome": "Prazeres",
        "lat": 38.71598,
        "lng": -9.16845,
        "ordem": 9
    },
    {
        "nome": "Campo Ourique",
        "lat": 38.71798,
        "lng": -9.16445,
        "ordem": 10
    },
    {
        "nome": "Estrela (regresso)",
        "lat": 38.71398,
        "lng": -9.15845,
        "ordem": 11
    },
    {
        "nome": "São Bento",
        "lat": 38.71298,
        "lng": -9.14945,
        "ordem": 12
    },
    {
        "nome": "Baixa (regresso)",
        "lat": 38.71398,
        "lng": -9.13698,
        "ordem": 13
    }
];

  // Estado para veículos e tripulantes
  const [veiculos, setVeiculos] = useState([
    {
        "chapa": "28E/6",
        "tripulante": "Fernando Sousa (18013)",
        "gpsAtivo": false,
        "proximaRendicao": "13:30",
        "paragem": 0
    },
    {
        "chapa": "28E/15",
        "tripulante": "Beatriz Lopes (18014)",
        "gpsAtivo": false,
        "proximaRendicao": "15:15",
        "paragem": 6
    },
    {
        "chapa": "28E/22",
        "tripulante": "André Carvalho (18015)",
        "gpsAtivo": false,
        "proximaRendicao": "17:30",
        "paragem": 10
    }
]);

  // Estado para localização do utilizador atual
  const [minhaLocalizacao, setMinhaLocalizacao] = useState(null);
  const [partilharGPS, setPartilharGPS] = useState(false);
  const [erroGPS, setErroGPS] = useState(null);

  // Estado para rendições
  const [proximaRendicao, setProximaRendicao] = useState({
    chapa: "28E/6",
    local: "Martim Moniz",
    hora: "16:30",
    tripulanteAtual: "Fernando Sousa (18013)"
  });

  // Estado para observações
  const [observacoes, setObservacoes] = useState([
    { texto: "Sistema de localização GPS ativo", hora: "14:41 27/09", autor: "Sistema", tipo: "info" }
  ]);

  const [novaObservacao, setNovaObservacao] = useState('');
  const [mostrarMapa, setMostrarMapa] = useState(true);

  // Função para iniciar partilha de GPS
  const iniciarPartilhaGPS = () => {
    if (!navigator.geolocation) {
      setErroGPS("GPS não disponível neste dispositivo");
      return;
    }

    setPartilharGPS(true);
    setErroGPS(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const novaLocalizacao = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        };
        
        setMinhaLocalizacao(novaLocalizacao);
        
        // TODO: Enviar para backend
        console.log("Localização atualizada:", novaLocalizacao);
        
        // Simular atualização no mapa
        setVeiculos(prevVeiculos => 
          prevVeiculos.map(v => 
            v.tripulante.includes(user?.numero) 
              ? { ...v, lat: novaLocalizacao.lat, lng: novaLocalizacao.lng, gpsAtivo: true, ultimaAtualizacao: new Date() }
              : v
          )
        );
      },
      (error) => {
        console.error("Erro GPS:", error);
        setErroGPS("Erro ao obter localização: " + error.message);
        setPartilharGPS(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Função para parar partilha de GPS
  const pararPartilhaGPS = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setPartilharGPS(false);
    setMinhaLocalizacao(null);
    
    console.log("Partilha de GPS parada");
  };

  // Função para fazer check-in de rendição
  const fazerCheckin = (local) => {
    const agora = new Date();
    const hora = `${agora.getHours()}:${agora.getMinutes().toString().padStart(2, '0')} ${agora.getDate()}/${agora.getMonth() + 1}`;
    
    const novaObs = {
      texto: `Cheguei ao ${local} para rendição`,
      hora,
      autor: user?.numero || '180001',
      tipo: 'checkin'
    };
    
    setObservacoes([novaObs, ...observacoes]);
    
    alert(`✅ Check-in registado!\n\nNotificação enviada para ${proximaRendicao.tripulanteAtual}`);
  };

  // Inicializar mapa Leaflet
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([38.715375384615385, -9.144498461538461], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const routeCoordinates = paragens.map(p => [p.lat, p.lng]);
    const routeLine = L.polyline(routeCoordinates, {
      color: '#6B7280',
      weight: 3,
      opacity: 0.5,
      dashArray: '5, 10'
    }).addTo(map);

    paragens.forEach((paragem, index) => {
      const isTerminal = index === 0 || index === paragens.length - 1;
      
      const marker = L.circleMarker([paragem.lat, paragem.lng], {
        radius: isTerminal ? 6 : 4,
        fillColor: isTerminal ? '#9333EA' : '#D1D5DB',
        color: '#fff',
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif;">
          <strong>${paragem.nome}</strong><br/>
          <span style="font-size: 12px; color: #666;">
            ${isTerminal ? 'Terminal' : 'Paragem'} ${paragem.ordem}
          </span>
        </div>
      `);
    });

    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Atualizar marcadores de veículos no mapa
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    map.eachLayer((layer) => {
      if (layer.options && layer.options.isVehicle) {
        map.removeLayer(layer);
      }
    });

    veiculos.forEach(veiculo => {
      let lat, lng, isEstimated = false;

      if (veiculo.gpsAtivo && veiculo.lat && veiculo.lng) {
        lat = veiculo.lat;
        lng = veiculo.lng;
      } else if (veiculo.paragem !== undefined) {
        const paragem = paragens[veiculo.paragem];
        lat = paragem.lat;
        lng = paragem.lng;
        isEstimated = true;
      } else {
        return;
      }

      const cor = veiculo.gpsAtivo ? '#3B82F6' : '#9CA3AF';
      const borda = veiculo.gpsAtivo ? '#1D4ED8' : '#6B7280';
      
      const veiculoMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="
              background-color: ${cor};
              color: white;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 12px;
              border: 3px solid ${borda};
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ${isEstimated ? 'opacity: 0.6;' : ''}
            ">
              ${veiculo.gpsAtivo ? '📍' : '⏱️'}
            </div>
            <div style="
              position: absolute;
              top: 45px;
              left: 50%;
              transform: translateX(-50%);
              background: white;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            ">
              ${veiculo.chapa}
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        }),
        isVehicle: true
      }).addTo(map);

      const statusTexto = veiculo.gpsAtivo ? '🔵 GPS Ativo' : '⚪ Posição Estimada';
      const ultimaAtt = veiculo.ultimaAtualizacao 
        ? `Última atualização: ${veiculo.ultimaAtualizacao.toLocaleTimeString()}`
        : 'Baseado em horário programado';

      veiculoMarker.bindPopup(`
        <div style="font-family: sans-serif;">
          <strong>${veiculo.chapa}</strong><br/>
          <span style="font-size: 12px;">
            Tripulante: ${veiculo.tripulante}<br/>
            ${statusTexto}<br/>
            <span style="font-size: 11px; color: #666;">${ultimaAtt}</span><br/>
            Próxima rendição: ${veiculo.proximaRendicao}
          </span>
        </div>
      `);
    });

    if (minhaLocalizacao) {
      L.marker([minhaLocalizacao.lat, minhaLocalizacao.lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="
              background-color: #10B981;
              color: white;
              border-radius: 50%;
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              animation: pulse 2s infinite;
            ">
              •
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        }),
        isVehicle: true
      }).addTo(map).bindPopup('📱 A minha localização');
    }
  }, [veiculos, minhaLocalizacao]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const adicionarObservacao = () => {
    if (novaObservacao.trim()) {
      const agora = new Date();
      const hora = `${agora.getHours()}:${agora.getMinutes().toString().padStart(2, '0')} ${agora.getDate()}/${agora.getMonth() + 1}`;
      
      setObservacoes([
        { texto: novaObservacao, hora, autor: user?.numero || '180001', tipo: 'info' },
        ...observacoes
      ]);
      setNovaObservacao('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center sticky top-0 z-50">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Carreira 28E</h1>
        <span className="ml-auto text-sm text-gray-600">
          Martim Moniz ↔ Campo Ourique (Circular)
        </span>
      </header>

      <main className="p-4 space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">📍</div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Partilhar Localização</h2>
              
              {!partilharGPS ? (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Ative a partilha de localização para que outros tripulantes possam ver onde está o seu elétrico em tempo real.
                  </p>
                  <button
                    onClick={iniciarPartilhaGPS}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    🚀 Ativar GPS durante Serviço
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">GPS Ativo - Localização a ser partilhada</span>
                  </div>
                  {minhaLocalizacao && (
                    <p className="text-xs text-gray-600 mb-3">
                      Última atualização: {minhaLocalizacao.timestamp.toLocaleTimeString()}<br/>
                      Precisão: ±{Math.round(minhaLocalizacao.accuracy)}m
                    </p>
                  )}
                  <button
                    onClick={pararPartilhaGPS}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                  >
                    ⏹️ Parar Partilha de GPS
                  </button>
                </>
              )}
              
              {erroGPS && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">⚠️ {erroGPS}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {proximaRendicao && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🔔</div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Próxima Rendição</h2>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Chapa:</strong> {proximaRendicao.chapa}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Local:</strong> {proximaRendicao.local}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Hora:</strong> {proximaRendicao.hora}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Tripulante Atual:</strong> {proximaRendicao.tripulanteAtual}
                  </p>
                </div>
                <button
                  onClick={() => fazerCheckin(proximaRendicao.local)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  ✅ Cheguei ao {proximaRendicao.local}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Isto irá notificar automaticamente o tripulante a ser rendido
                </p>
              </div>
            </div>
          </div>
        )}

        {mostrarMapa && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Mapa em Tempo Real</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {veiculos.filter(v => v.gpsAtivo).length} elétricos com GPS ativo • {veiculos.filter(v => !v.gpsAtivo).length} estimados
                  </p>
                </div>
                <button
                  onClick={() => setMostrarMapa(false)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Ocultar
                </button>
              </div>
            </div>
            <div 
              ref={mapRef} 
              style={{ height: '450px', width: '100%' }}
              className="leaflet-container"
            />
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">📍</div>
                  <span><strong>🔵 GPS Ativo</strong> - Localização confirmada em tempo real</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs opacity-60">⏱️</div>
                  <span><strong>⚪ Posição Estimada</strong> - Baseado em horário programado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                  <span>Terminais (Martim Moniz / Campo Ourique)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!mostrarMapa && (
          <div className="bg-blue-50 rounded-lg p-4">
            <button
              onClick={() => setMostrarMapa(true)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              🗺️ Mostrar Mapa Interativo
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Elétricos em Serviço</h2>
          <div className="space-y-3">
            {veiculos.map((veiculo, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-900">{veiculo.chapa}</span>
                      {veiculo.gpsAtivo ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          🔵 GPS Ativo
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">
                          ⚪ Estimado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Tripulante: {veiculo.tripulante}
                    </p>
                    <p className="text-sm text-gray-600">
                      Próxima rendição: {veiculo.proximaRendicao}
                    </p>
                    {veiculo.ultimaAtualizacao && (
                      <p className="text-xs text-gray-500 mt-1">
                        Atualizado: {veiculo.ultimaAtualizacao.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Observações e Check-ins</h2>
          
          <div className="space-y-3 mb-4">
            {observacoes.map((obs, index) => (
              <div key={index} className={`p-3 rounded-lg ${obs.tipo === 'checkin' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                {obs.tipo === 'checkin' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-600 font-bold text-sm">✅ CHECK-IN</span>
                  </div>
                )}
                <p className="text-gray-800">{obs.texto}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {obs.hora} | {obs.autor}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={novaObservacao}
              onChange={(e) => setNovaObservacao(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && adicionarObservacao()}
              placeholder="Adicionar observação..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={adicionarObservacao}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              ➕
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            As observações são apagadas automaticamente todos os dias às 3h da manhã.
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🤖</div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Chat AI - Carreira 28E</h2>
              <p className="text-sm text-gray-600 mb-3">
                Olá! Sou o assistente da Carreira 28E. Posso ajudar com:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• Horários e frequências da 28E</li>
                <li>• Estado das paragens</li>
                <li>• Interrupções de serviço</li>
                <li>• Informações sobre esta carreira</li>
              </ul>
              <button
                onClick={() => navigate('/chat-carreira?carreira=28E')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Iniciar Chat
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default Carreira28EPage;
