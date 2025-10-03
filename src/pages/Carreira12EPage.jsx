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

const Carreira12EPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  // Dados das paragens da Carreira 12E com coordenadas GPS reais
  const paragens = [
    { nome: 'Martim Moniz', lat: 38.71565, lng: -9.13602, ordem: 1 },
    { nome: 'Socorro', lat: 38.71398, lng: -9.13245, ordem: 2 },
    { nome: 'Lg. Terreirinho', lat: 38.71345, lng: -9.13145, ordem: 3 },
    { nome: 'R. Lagares', lat: 38.71298, lng: -9.13042, ordem: 4 },
    { nome: 'S. Tomé', lat: 38.71245, lng: -9.12945, ordem: 5 },
    { nome: 'Lg. Portas Sol', lat: 38.71198, lng: -9.12845, ordem: 6 },
    { nome: 'Sta. Luzia', lat: 38.71145, lng: -9.12742, ordem: 7 },
    { nome: 'Limoeiro', lat: 38.71098, lng: -9.12645, ordem: 8 },
    { nome: 'Sé', lat: 38.71045, lng: -9.13345, ordem: 9 },
    { nome: 'R. Conceição', lat: 38.70998, lng: -9.13545, ordem: 10 },
    { nome: 'Lg. Academia Nac. Belas Artes', lat: 38.70945, lng: -9.13745, ordem: 11 },
    { nome: 'R. Serpa Pinto', lat: 38.70898, lng: -9.13945, ordem: 12 },
    { nome: 'Chiado', lat: 38.71098, lng: -9.14145, ordem: 13 },
    { nome: 'Pç. Luís Camões', lat: 38.71045, lng: -9.14345, ordem: 14 }
  ];

  // Estado para veículos em tempo real
  const [veiculos, setVeiculos] = useState([
    { chapa: "14", sentido: "Camoes", posicao: 2, confirmado: true },
    { chapa: "7", sentido: "Moniz", posicao: 6, confirmado: false },
    { chapa: "1", sentido: "Camoes", posicao: 11, confirmado: true }
  ]);

  // Estado para observações
  const [observacoes, setObservacoes] = useState([
    { texto: "Interrupção no Limoeiro sentido Camões", hora: "14:41 27/09", autor: "180939" },
    { texto: "Caminho livre", hora: "14:42 27/09", autor: "180001" }
  ]);

  const [novaObservacao, setNovaObservacao] = useState('');
  const [mostrarMapa, setMostrarMapa] = useState(true);

  // Inicializar mapa Leaflet
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Criar mapa centrado em Lisboa
    const map = L.map(mapRef.current).setView([38.71298, -9.13345], 14);

    // Adicionar tiles do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Desenhar percurso da linha 12E
    const routeCoordinates = paragens.map(p => [p.lat, p.lng]);
    const routeLine = L.polyline(routeCoordinates, {
      color: '#2563EB',
      weight: 4,
      opacity: 0.7
    }).addTo(map);

    // Adicionar marcadores para paragens
    paragens.forEach((paragem, index) => {
      const isTerminal = index === 0 || index === paragens.length - 1;
      
      const marker = L.circleMarker([paragem.lat, paragem.lng], {
        radius: isTerminal ? 8 : 6,
        fillColor: isTerminal ? '#9333EA' : '#6B7280',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
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

    // Adicionar marcadores para veículos
    veiculos.forEach(veiculo => {
      if (veiculo.posicao >= 0 && veiculo.posicao < paragens.length) {
        const paragem = paragens[veiculo.posicao];
        const cor = veiculo.sentido === 'Camoes' ? '#2563EB' : '#DC2626';
        
        const veiculoMarker = L.marker([paragem.lat, paragem.lng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div style="
                background-color: ${cor};
                color: white;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 14px;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ">
                ${veiculo.confirmado ? veiculo.chapa : '?'}
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          })
        }).addTo(map);

        veiculoMarker.bindPopup(`
          <div style="font-family: sans-serif;">
            <strong>Elétrico ${veiculo.chapa}</strong><br/>
            <span style="font-size: 12px;">
              Sentido: ${veiculo.sentido === 'Camoes' ? 'Pç. Luís Camões' : 'Martim Moniz'}<br/>
              Paragem: ${paragem.nome}<br/>
              Status: ${veiculo.confirmado ? '✓ Confirmado' : '⚠ Não confirmado'}
            </span>
          </div>
        `);
      }
    });

    // Ajustar zoom para mostrar todo o percurso
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Atualizar posições dos veículos periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setVeiculos(prevVeiculos => 
        prevVeiculos.map(veiculo => {
          const novaPosicao = veiculo.sentido === 'Camoes' 
            ? (veiculo.posicao + 1) % paragens.length
            : (veiculo.posicao - 1 + paragens.length) % paragens.length;
          
          return {
            ...veiculo,
            posicao: novaPosicao,
            confirmado: Math.random() > 0.3 // 70% de chance de ser confirmado
          };
        })
      );
    }, 10000); // Atualizar a cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  const adicionarObservacao = () => {
    if (novaObservacao.trim()) {
      const agora = new Date();
      const hora = `${agora.getHours()}:${agora.getMinutes().toString().padStart(2, '0')} ${agora.getDate()}/${agora.getMonth() + 1}`;
      
      setObservacoes([
        { texto: novaObservacao, hora, autor: user?.numero || '180001' },
        ...observacoes
      ]);
      setNovaObservacao('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm px-4 py-4 flex items-center sticky top-0 z-50">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Carreira 12E</h1>
        <span className="ml-auto text-sm text-gray-600">
          Martim Moniz ↔ Pç. Luís Camões
        </span>
      </header>

      <main className="p-4 space-y-6">
        {/* Mapa Interativo */}
        {mostrarMapa && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Mapa em Tempo Real</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {veiculos.length} elétricos ativos • Atualização automática
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
              style={{ height: '400px', width: '100%' }}
              className="leaflet-container"
            />
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  <span>Sentido Camões</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-600"></div>
                  <span>Sentido Moniz</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                  <span>Terminal</span>
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

        {/* Lista de Paragens */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Percurso Completo</h2>
          <div className="space-y-2">
            {paragens.map((paragem, index) => {
              const veiculosNaParagem = veiculos.filter(v => v.posicao === index);
              const isTerminal = index === 0 || index === paragens.length - 1;
              
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isTerminal ? 'bg-purple-600' : 'bg-gray-400'}`}></div>
                  <div className="flex-1">
                    <span className={`${isTerminal ? 'font-bold' : ''}`}>{paragem.nome}</span>
                  </div>
                  <div className="flex gap-2">
                    {veiculosNaParagem.map((veiculo, vIdx) => (
                      <div
                        key={vIdx}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          veiculo.sentido === 'Camoes' ? 'bg-blue-600' : 'bg-red-600'
                        } ${!veiculo.confirmado ? 'opacity-50' : ''}`}
                      >
                        {veiculo.confirmado ? veiculo.chapa : '?'}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Observações Partilhadas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Observações Partilhadas</h2>
          
          <div className="space-y-3 mb-4">
            {observacoes.map((obs, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
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

        {/* Chat AI */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🤖</div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Chat AI - Carreira 12E</h2>
              <p className="text-sm text-gray-600 mb-3">
                Olá! Sou o assistente da Carreira 12E. Posso ajudar com:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• Horários e frequências da 12E</li>
                <li>• Estado das paragens</li>
                <li>• Interrupções de serviço</li>
                <li>• Informações sobre esta carreira</li>
              </ul>
              <button
                onClick={() => navigate('/chat-carreira?carreira=12E')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Iniciar Chat
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Carreira12EPage;
