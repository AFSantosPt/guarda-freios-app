import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function GestaoAvariasPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [numeroVeiculo, setNumeroVeiculo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState(null);
  const [avarias, setAvarias] = useState([
    { id: 1, chapa: '501', data: '2025-09-20', estado: 'Resolvida', descricao: 'Problema no freio dianteiro', reporter: '18002' },
    { id: 2, chapa: '523', data: '2025-09-21', estado: 'Pendente', descricao: 'Luzes internas não acendem', reporter: '18003' },
    { id: 3, chapa: '542', data: '2025-09-22', estado: 'Em Resolução', descricao: 'Porta traseira com dificuldade de fecho', reporter: '18001' },
  ]);
  const [filtroChapa, setFiltroChapa] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroData, setFiltroData] = useState('');

  const handleReportarAvaria = async (e) => {
    e.preventDefault();
    if (numeroVeiculo && descricao) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        // Simulação de upload de ficheiro (o upload real seria mais complexo)
        const ficheiros = foto ? ['/url/da/foto.jpg'] : []; 

        const response = await axios.post(`${API_URL}/api/avariass`, {
          numero_veiculo: numeroVeiculo,
          descricao,
          ficheiros,
        });

        const novaAvaria = response.data.avaria;
        setAvarias([novaAvaria, ...avarias]); // Adicionar a nova avaria ao topo
        setNumeroVeiculo('');
        setDescricao('');
        setFoto(null);
        alert('Avaria reportada com sucesso!');
      } catch (error) {
        console.error('Erro ao reportar avaria:', error);
        alert(`Erro ao reportar avaria: ${error.response?.data?.message || 'Erro de rede'}`);
      }
    } else {
      alert('Por favor, preencha o número do veículo e a descrição da avaria.');
    }
  };

  const handleFileChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const handleAtualizarEstado = (id, novoEstado) => {
    setAvarias(avarias.map(av => av.id === id ? { ...av, estado: novoEstado } : av));
  };

  const avariasFiltradas = avarias.filter(avaria => {
    const matchChapa = filtroChapa ? avaria.numero_veiculo.includes(filtroChapa) : true;
    const matchEstado = filtroEstado === 'Todos' ? true : avaria.estado === filtroEstado;
    const matchData = filtroData ? avaria.data === filtroData : true;
    return matchChapa && matchEstado && matchData;
  });

  const isTripulantePlus = user && user.tipo === 'Gestor';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 text-blue-600"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Gestão de Avarias</h1>
      </header>

      <main className="p-4">
        {/* Seção de Reportar Avaria */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reportar Nova Avaria</h2>
          <form onSubmit={handleReportarAvaria} className="space-y-4">
            <div>
              <label htmlFor="numeroVeiculo" className="block text-sm font-medium text-gray-700">Nº Veículo</label>
              <input
                type="text"
                id="numeroVeiculo"
                value={numeroVeiculo}
                onChange={(e) => setNumeroVeiculo(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ex: 501"
                required
              />
            </div>
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição da Avaria</label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Descreva o problema em detalhe..."
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="foto" className="block text-sm font-medium text-gray-700">Anexar Foto (Opcional)</label>
              <input
                type="file"
                id="foto"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {foto && <p className="mt-2 text-sm text-gray-500">Ficheiro selecionado: {foto.name}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-200"
            >
              Reportar Avaria
            </button>
          </form>
        </div>

        {/* Seção de Histórico de Avarias */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Avarias</h2>
          
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="filtroChapa" className="block text-sm font-medium text-gray-700">Filtrar por Nº Veículo</label>
              <input
                type="text"
                id="filtroChapa"
                value={filtroChapa}
                onChange={(e) => setFiltroChapa(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ex: 501"
              />
            </div>
            <div>
              <label htmlFor="filtroEstado" className="block text-sm font-medium text-gray-700">Filtrar por Estado</label>
              <select
                id="filtroEstado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option>Todos</option>
                <option>Pendente</option>
                <option>Em Resolução</option>
                <option>Resolvida</option>
              </select>
            </div>
            <div>
              <label htmlFor="filtroData" className="block text-sm font-medium text-gray-700">Filtrar por Data</label>
              <input
                type="date"
                id="filtroData"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Lista de Avarias */}
          {avariasFiltradas.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma avaria encontrada.</p>
          ) : (
            <div className="space-y-4">
              {avariasFiltradas.map((avaria) => (
                <div key={avaria.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-bold text-gray-900">Nº Veículo: {avaria.numero_veiculo}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      avaria.estado === 'Pendente' ? 'bg-red-100 text-red-800' :
                      avaria.estado === 'Em Resolução' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {avaria.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{avaria.descricao}</p>
                  <p className="text-xs text-gray-500">Reportado por: {avaria.reporter} em {avaria.data}</p>
                  
                  {isTripulantePlus && avaria.estado !== 'Resolvida' && (
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => handleAtualizarEstado(avaria.id, 'Em Resolução')}
                        className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                      >
                        Marcar como Em Resolução
                      </button>
                      <button
                        onClick={() => handleAtualizarEstado(avaria.id, 'Resolvida')}
                        className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md"
                      >
                        Marcar como Resolvida
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default GestaoAvariasPage;

