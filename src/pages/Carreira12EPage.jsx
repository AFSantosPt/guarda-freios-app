import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Criar ícones personalizados
const criarIcone = (cor, chapa) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color:${cor};
      color:#fff;
      width:28px;
      height:28px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:12px;
      font-weight:bold;
      border:2px solid white;
      ">
      ${chapa}
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const Carreira12EPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [veiculos, setVeiculos] = useState([]);
  const [observacoes, setObservacoes] = useState([]);
  const [novaObservacao, setNovaObservacao] = useState('');

  // Paragens principais (podes adicionar coordenadas reais mais tarde)
  const paragens = [
    { nome: "Martim Moniz", coords: [38.7169, -9.139] },
    { nome: "Socorro", coords: [38.7165, -9.1385] },
    { nome: "Sta. Luzia", coords: [38.711, -9.129] },
    { nome: "Sé", coords: [38.710, -9.132] },
    { nome: "Chiado", coords: [38.7105, -9.142] },
    { nome: "Pç. Luís Camões", coords: [38.7107, -9.144] }
  ];

  // Mock inicial de elétricos
  useEffect(() => {
    setVeiculos([
      { chapa: "14", sentido: "Camoes", coords: [38.715, -9.137], confirmado: true },
      { chapa: "7", sentido: "Moniz", coords: [38.712, -9.134], confirmado: false },
      { chapa: "1", sentido: "Moniz", coords: [38.711, -9.140], confirmado: true }
    ]);
  }, []);

  // Atualização em tempo real (simulação por enquanto)
  useEffect(() => {
    const interval = setInterval(() => {
      setVeiculos(prev =>
        prev.map(v => ({
          ...v,
          coords: [
            v.coords[0] + (Math.random() - 0.5) * 0.0005,
            v.coords[1] + (Math.random() - 0.5) * 0.0005
          ]
        }))
      );
    }, 1000); // Atualiza de 1 em 1 segundo
    return () => clearInterval(interval);
  }, []);

  const handleAdicionarObservacao = () => {
    if (novaObservacao.trim()) {
      const agora = new Date();
      const hora = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')} ${agora.getDate().toString().padStart(2, '0')}/${(agora.getMonth() + 1).toString().padStart(2, '0')}`;
      const novaObs = { autor: user?.numero || 'Anónimo', msg: novaObservacao, hora };
      setObservacoes([...observacoes, novaObs]);
      setNovaObservacao('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button onClick={() => navigate('/dashboard')} className="mr-4 p-2 text-blue-600">
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Carreira 12E</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Mapa */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Mapa em Tempo Real</h2>
          <MapContainer
            center={[38.713, -9.139]}
            zoom={15}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* Paragens */}
            {paragens.map((p, i) => (
              <Marker key={i} position={p.coords}>
                <Popup>{p.nome}</Popup>
              </Marker>
            ))}

            {/* Elétricos */}
            {veiculos.map((v, i) => (
              <Marker
                key={i}
                position={v.coords}
                icon={criarIcone(
                  v.sentido === "Camoes" ? "blue" : "red",
                  v.confirmado ? v.chapa : "?"
                )}
              >
                <Popup>
                  Elétrico {v.chapa} <br />
                  Sentido: {v.sentido}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Observações */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Observações</h2>
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {observacoes.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma observação registada.</p>
            ) : (
              observacoes.map((obs, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-800">{obs.msg}</p>
                  <p className="text-xs text-gray-500 mt-1">{obs.hora} | {obs.autor}</p>
                </div>
              ))
            )}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={novaObservacao}
              onChange={(e) => setNovaObservacao(e.target.value)}
              placeholder="Adicionar observação..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={handleAdicionarObservacao}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              ➕
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Carreira12EPage;