import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { carreiraParagens } from '../lib/carreiraParagens';

const Carreira25EPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const paragens = carreiraParagens['25E'];

  // Estado para veículos em tempo real
  const [veiculos, setVeiculos] = useState([
    { chapa: "14", sentido: "Camoes", posicao: 2, confirmado: true },
    { chapa: "7", sentido: "Moniz", posicao: 6, confirmado: false },
    { chapa: "1", sentido: "Moniz", posicao: 10, confirmado: true }
  ]);

  // Estado para observações
  const [observacoes, setObservacoes] = useState([
    { autor: "180939", msg: "Interrupção no Limoeiro sentido Camões", hora: "14:41 27/09" },
    { autor: "180001", msg: "Caminho livre", hora: "14:42 27/09" }
  ]);

  const [novaObservacao, setNovaObservacao] = useState('');

  // Simular atualização de dados em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular movimento dos elétricos (opcional)
      setVeiculos(prevVeiculos => 
        prevVeiculos.map(veiculo => ({
          ...veiculo,
          // Pequena chance de mudança de posição para simular movimento
          posicao: Math.random() > 0.9 ? 
            Math.max(0, Math.min(paragens.length - 1, veiculo.posicao + (Math.random() > 0.5 ? 1 : -1))) : 
            veiculo.posicao
        }))
      );
    }, 10000); // Atualizar a cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  const handleAdicionarObservacao = () => {
    if (novaObservacao.trim()) {
      const agora = new Date();
      const hora = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')} ${agora.getDate().toString().padStart(2, '0')}/${(agora.getMonth() + 1).toString().padStart(2, '0')}`;
      
      const novaObs = {
        autor: user?.numero || 'Anónimo',
        msg: novaObservacao,
        hora: hora
      };

      setObservacoes([...observacoes, novaObs]);
      setNovaObservacao('');
    }
  };

  // Função para obter veículos numa paragem específica
  const getVeiculosNaParagem = (index) => {
    return veiculos.filter(veiculo => veiculo.posicao === index);
  };

  // Função para renderizar círculos dos elétricos
  const renderVeiculosCirculos = (veiculosNaParagem) => {
    if (veiculosNaParagem.length === 0) return null;

    return (
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 text-blue-600"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Carreira 25E</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Percurso */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Percurso</h2>
          <div className="relative">
            {/* Linha central */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            {/* Paragens */}
            <div className="space-y-4">
              {paragens.map((paragem, index) => {
                const veiculosNaParagem = getVeiculosNaParagem(index);
                const isTerminal = index === 0 || index === paragens.length - 1;
                
                return (
                  <div key={index} className="flex items-center">
                    {/* Ponto da paragem */}
                    <div className={`w-3 h-3 rounded-full z-10 ${
                      isTerminal ? 'bg-purple-500' : 'bg-gray-400'
                    }`}></div>
                    
                    {/* Nome da paragem */}
                    <div className="ml-4 flex-1">
                      <span className={`text-sm font-medium ${
                        isTerminal ? 'text-purple-600' : 'text-gray-700'
                      }`}>
                        {paragem}
                      </span>
                    </div>
                    
                    {/* Círculos dos elétricos */}
                    {renderVeiculosCirculos(veiculosNaParagem)}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Legenda */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Legenda:</h3>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span>🔵 Sentido Camões (Confirmado)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                <span>🔴 Sentido Martim Moniz (Confirmado)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-blue-500 rounded-full mr-2"></div>
                <span>⚪ Não Confirmado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Observações Partilhadas</h2>
          
          {/* Lista de observações */}
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {observacoes.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma observação registada.</p>
            ) : (
              observacoes.map((obs, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{obs.msg}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {obs.hora} | {obs.autor}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Adicionar nova observação */}
          <div className="border-t pt-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={novaObservacao}
                onChange={(e) => setNovaObservacao(e.target.value)}
                placeholder="Adicionar observação..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAdicionarObservacao()}
              />
              <button
                onClick={handleAdicionarObservacao}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                ➕
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              As observações são apagadas automaticamente todos os dias às 3h da manhã.
            </p>
          </div>
        </div>

        {/* Chat AI */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Chat AI - Carreira 25E</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              🤖 Olá! Sou o assistente da Carreira 25E. Posso ajudar com:
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Horários e frequências da 25E</li>
              <li>• Estado das paragens</li>
              <li>• Interrupções de serviço</li>
              <li>• Informações sobre esta carreira</li>
            </ul>
            <button
              onClick={() => navigate('/chat-carreira?carreira=12E')}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Iniciar Chat
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Carreira25EPage;

