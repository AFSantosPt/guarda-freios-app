import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import axios from 'axios';
import { MapPin, Clock, Info, CheckCircle } from 'lucide-react';

function CarreiraPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [trajeto, setTrajeto] = useState(null);
  const [loadingTrajeto, setLoadingTrajeto] = useState(false);
  const [erroTrajeto, setErroTrajeto] = useState(null);

  const carreira = '28E'; // Exemplo de carreira
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchTrajeto = async () => {
    setLoadingTrajeto(true);
    setErroTrajeto(null);
    try {
      const response = await axios.get(`${API_URL}/api/trajetos/atualizar/${carreira}`);
      setTrajeto(response.data.trajeto);
    } catch (error) {
      console.error('Erro ao buscar trajeto:', error);
      setErroTrajeto('Erro ao carregar trajeto. Tente novamente.');
    } finally {
      setLoadingTrajeto(false);
    }
  };

  useEffect(() => {
    fetchTrajeto();
  }, []);

  const isTripulantePlus = user && user.tipo === 'Gestor';

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadMessage('');
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Simulação de upload e OCR
      setUploadMessage(`Ficheiro '${selectedFile.name}' carregado com sucesso! (Simulação de OCR)`);
      setSelectedFile(null);
    } else {
      setUploadMessage('Por favor, selecione um ficheiro para carregar.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 text-blue-600"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Carreira 28E/5 (Exemplo)</h1>
      </header>

      <main className="p-4">
        {/* 6️⃣ FUNCIONALIDADE DE CHECK-IN DE RENDIÇÕES */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col items-center">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Rendição</h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Ao aproximar-se do ponto de rendição, clique no botão para notificar o seu colega.
          </p>
          <button
            onClick={() => alert('Notificação de rendição enviada! (Simulação)')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-colors duration-200 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" /> Cheguei ao ponto X
          </button>
        </div>

        {/* 5️⃣ INTEGRAÇÃO COM MAPAS E LOCALIZAÇÃO */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" /> Localização em Tempo Real
          </h2>
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-4">
            {/* Simulação de Mapa */}
            Mapa da Carreira 28E (Integração com TRANSITLAND ou similar)
          </div>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Info className="w-4 h-4 text-blue-500" />
            Última atualização: {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* 7️⃣ ATUALIZAÇÃO AUTOMÁTICA DOS TRAJETOS (Carris) */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" /> Trajeto e Paragens
          </h2>
          {loadingTrajeto ? (
            <p className="text-center text-gray-500">A carregar trajeto...</p>
          ) : erroTrajeto ? (
            <p className="text-center text-red-500">{erroTrajeto}</p>
          ) : trajeto ? (
            <div className="space-y-3">
              <p className="text-sm font-medium">{trajeto.descricao}</p>
              <p className="text-xs text-gray-500">Atualizado em: {new Date(trajeto.ultimaAtualizacao).toLocaleString()}</p>
              <h3 className="font-semibold mt-4">Paragens:</h3>
              <ul className="list-disc list-inside text-sm max-h-40 overflow-y-auto">
                {trajeto.paragens.map((paragem, index) => (
                  <li key={index}>{paragem}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500">Informações do trajeto não disponíveis.</p>
          )}
          <button
            onClick={fetchTrajeto}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-200"
          >
            Atualizar Trajeto
          </button>
        </div>
      </main>
    </div>
  );
}

export default CarreiraPage;

