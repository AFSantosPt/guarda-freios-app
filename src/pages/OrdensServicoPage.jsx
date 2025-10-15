import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import api from '../services/api';

export default function OrdensServicoPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrdem, setSelectedOrdem] = useState(null);

  const [formData, setFormData] = useState({
    assunto: '',
    descricao: '',
    tempo_expiracao: '',
    ficheiro: null
  });

  useEffect(() => {
    loadOrdens();
  }, []);

  const loadOrdens = async () => {
    try {
      const response = await api.getOrdens();
      if (response.success) {
        setOrdens(response.ordens);
      }
    } catch (err) {
      console.error('Erro ao carregar ordens:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, ficheiro: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let ficheiro_url = null;
      let ficheiro_nome = null;

      // Upload do ficheiro se existir
      if (formData.ficheiro) {
        // TODO: Implementar upload real para servidor/S3
        // Por agora, simular URL
        ficheiro_nome = formData.ficheiro.name;
        ficheiro_url = `https://exemplo.com/uploads/${ficheiro_nome}`;
      }

      const response = await api.createOrdem({
        criado_por: user.id,
        assunto: formData.assunto,
        descricao: formData.descricao,
        tempo_expiracao: formData.tempo_expiracao ? parseInt(formData.tempo_expiracao) : null,
        ficheiro_url,
        ficheiro_nome
      });

      if (response.success) {
        setSuccess('Ordem de serviço criada com sucesso!');
        setShowModal(false);
        setFormData({
          assunto: '',
          descricao: '',
          tempo_expiracao: '',
          ficheiro: null
        });
        loadOrdens();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Erro ao criar ordem');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ordemId) => {
    if (!confirm('Tem a certeza que deseja excluir esta ordem?')) {
      return;
    }

    try {
      const response = await api.deleteOrdem(ordemId, user.id);
      
      if (response.success) {
        setSuccess('Ordem excluída com sucesso!');
        loadOrdens();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Erro ao excluir ordem');
    }
  };

  const openDetailModal = (ordem) => {
    setSelectedOrdem(ordem);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-gray-900">Ordens de Serviço</h1>
        </div>
        {user?.cargo === 'Gestor' && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            + Nova Ordem
          </button>
        )}
      </header>

      {/* Mensagens */}
      <main className="p-4">
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Lista de Ordens */}
        <div className="space-y-4">
          {ordens.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Nenhuma ordem de serviço ativa</p>
            </div>
          ) : (
            ordens.map((ordem) => (
              <div key={ordem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{ordem.assunto}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ordem.descricao}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📅 {formatDate(ordem.created_at)}</span>
                      <span>👤 {ordem.criador_nome}</span>
                      {ordem.expira_em && (
                        <span className="text-orange-600">⏰ Expira: {formatDate(ordem.expira_em)}</span>
                      )}
                      {ordem.ficheiro_nome && (
                        <span>📎 {ordem.ficheiro_nome}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openDetailModal(ordem)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Ver Detalhes
                    </button>
                    {user?.cargo === 'Gestor' && (
                      <button
                        onClick={() => handleDelete(ordem.id)}
                        className="text-red-600 hover:text-red-800 text-xl"
                        title="Excluir ordem"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal de Criar Ordem */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Nova Ordem de Serviço</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assunto *
                </label>
                <input
                  type="text"
                  value={formData.assunto}
                  onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Ex: Manutenção programada"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
                  placeholder="Descreva a ordem de serviço..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tempo de Expiração (horas)
                </label>
                <input
                  type="number"
                  value={formData.tempo_expiracao}
                  onChange={(e) => setFormData({ ...formData, tempo_expiracao: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Ex: 24 (deixe vazio para sem expiração)"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A ordem será automaticamente removida após este período
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anexar Ficheiro
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  PDF, imagens ou documentos relevantes
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'A criar...' : 'Criar Ordem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showDetailModal && selectedOrdem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{selectedOrdem.assunto}</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Descrição</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedOrdem.descricao}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Criado por</h4>
                  <p className="text-gray-900">{selectedOrdem.criador_nome}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Data de Criação</h4>
                  <p className="text-gray-900">{formatDate(selectedOrdem.created_at)}</p>
                </div>
              </div>

              {selectedOrdem.expira_em && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Expira em</h4>
                  <p className="text-orange-600">{formatDate(selectedOrdem.expira_em)}</p>
                </div>
              )}

              {selectedOrdem.ficheiro_url && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Ficheiro Anexo</h4>
                  <a
                    href={selectedOrdem.ficheiro_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    📎 {selectedOrdem.ficheiro_nome}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

