import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ícone dos elétricos
const tramIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png",
  iconSize: [30, 30],
});

const Carreira12EPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Paragens fixas
  const paragens = [
    'Martim Moniz',
    'Socorro',
    'Lg. Terreirinho',
    'R. Lagares',
    'S. Tomé',
    'Lg. Portas Sol',
    'Sta. Luzia',
    'Limoeiro',
    'Sé',
    'R. Conceição',
    'Lg. Academia Nac. Belas Artes',
    'R. Serpa Pinto',
    'Chiado',
    'Pç. Luís Camões'
  ];

  // Estado real de veículos
  const [veiculos, setVeiculos] = useState([]);

  // Observações
  const [observacoes, setObservacoes] = useState([]);
  const [novaObservacao, setNovaObservacao] = useState('');

  // Fetch simulado de API da Carris
  useEffect(() => {
    const fetchDados = async () => {
      try {
        // Substituir pela API real da Carris quando disponível
        // const response = await fetch("https://api.carris.pt/realtime/12E");
        // const data = await response.json();
        // setVeiculos(data.vehicles);

        // Simulação provisória
        setVeiculos([
          { chapa: "14", sentido: "Camoes", posicao: 2, confirmado: true, lat: 38.7139, lng: -9.1335 },
          { chapa: "7", sentido: "Moniz", posicao: 6, confirmado: false, lat: 38.7165, lng: -9.1280 },
          { chapa: "1", sentido: "Moniz", posicao: 10, confirmado: true, lat: 38.7095, lng: -9.1360 }
        ]);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchDados();
    const interval = setInterval(fetchDados, 5000);
    return () => clearInterval(interval);
  }, []);

  // Adicionar observações
  const handleAdicionarObservacao = () => {
    if (novaObservacao.trim()) {
      const agora = new Date();
      const hora = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')} ${agora.getDate().toString().padStart(2, '0')}/${(agora.getMonth() + 1).toString().padStart(2, '0')}`;
      const novaObs = { autor: user?.numero || 'Anónimo', msg: novaObservacao, hora };
      setObservacoes([...observacoes, novaObs]);
      setNovaObservacao('');
    }
  };

  // Veículos por paragem
  const getVeiculosNaParagem = (index) => veiculos.filter(v => v.posicao === index);

  const renderVeiculosCirculos = (veiculosNaParagem) => (
    <div className="flex space-x-1 ml-4">
      {veiculosNaParagem.map((veiculo, index) => (
        <div
          key={`${veiculo.chapa}-${index}`}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            veiculo.confirmado
              ? veiculo.sentido === 'Camoes'
                ? 'bg-blue-500 text-white'
                : 'bg-red-500 text-white'
              : veiculo.sentido === 'Camoes'
                ? 'border-2 border-blue-500 bg-transparent text-blue-500'
                : 'border-2 border-red-500 bg-transparent text-red-500'
          }`}
        >
          {veiculo.confirmado ? veiculo.chapa : ''}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button onClick={() => navigate('/dashboard')} className="mr-4 p-2 text-blue-600">←</button>
        <h1 className="text-xl font-bold text-gray-900">Carreira 12E</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Mapa Interativo */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Mapa Interativo</h2>
          <MapContainer center={[38.7139, -9.1335]} zoom={14} style={{ height: "300px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {veiculos.map((v, idx) => (
              <Marker key={idx} position={[v.lat, v.lng]} icon={tramIcon}>
                <Popup>Elétrico {v.chapa} - Sentido {v.sentido}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Lista de Paragens */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Percurso</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            <div className="space-y-4">
              {paragens.map((paragem, index) => {
                const veiculosNaParagem = getVeiculosNaParagem(index);
                const isTerminal = index === 0 || index === paragens.length - 1;
                return (
                  <div key={index} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full z-10 ${isTerminal ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
                    <div className="ml-4 flex-1">
                      <span className={`text-sm font-medium ${isTerminal ? 'text-purple-600' : 'text-gray-700'}`}>
                        {paragem}
                      </span>
                    </div>
                    {renderVeiculosCirculos(veiculosNaParagem)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Observações Partilhadas</h2>
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {observacoes.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma observação registada.</p>
            ) : (
              observacoes.map((obs, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-800">{obs.msg}</p>
                  <p className="text-xs text-gray-500 mt-1">{obs.hora} | {obs.autor}</p>
                </div>
              ))
            )}
          </div>
          <div className="border-t pt-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={novaObservacao}
                onChange={(e) => setNovaObservacao(e.target.value)}
                placeholder="Adicionar observação..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAdicionarObservacao()}
              />
              <button onClick={handleAdicionarObservacao} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">➕</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Carreira12EPage;