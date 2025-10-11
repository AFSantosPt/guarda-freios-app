import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import api from '../services/api';

export default function GestaoUtilizadoresPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [utilizadores, setUtilizadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'delete'
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    numero: '',
    nome: '',
    email: '',
    cargo: 'Tripulante',
    password: ''
  });

  // Verificar se o utilizador é Gestor
  useEffect(() => {
    if (!user || user.tipo !== 'Gestor') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Carregar utilizadores do backend
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.getUsers();
      if (response.success) {
        setUtilizadores(response.users);
      }
    } catch (err) {
      console.error('Erro ao carregar utilizadores:', err);
      setError('Erro ao carregar utilizadores');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      numero: '',
      nome: '',
      email: '',
      cargo: 'Tripulante',
      password: ''
    });
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      numero: user.numero,
      nome: user.nome,
      email: user.email,
      cargo: user.cargo,
      password: ''
    });
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const openDeleteModal = (user) => {
    setModalMode('delete');
    setSelectedUser(user);
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (modalMode === 'create') {
        // Criar novo utilizador
        if (!formData.numero || !formData.nome || !formData.email || !formData.password) {
          setError('Todos os campos são obrigatórios');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('A password deve ter pelo menos 6 caracteres');
          setLoading(false);
          return;
        }

        const response = await api.register(
          formData.numero,
          formData.nome,
          formData.email,
          formData.cargo,
          formData.password
        );

        if (response.success) {
          setSuccess('Utilizador criado com sucesso!');
          setShowModal(false);
          loadUsers();
        }
      } else if (modalMode === 'edit') {
        // Editar utilizador existente
        if (!formData.nome || !formData.email) {
          setError('Nome e email são obrigatórios');
          setLoading(false);
          return;
        }

        if (formData.password && formData.password.length < 6) {
          setError('A password deve ter pelo menos 6 caracteres');
          setLoading(false);
          return;
        }

        const response = await api.updateUser(
          selectedUser.id,
          formData.nome,
          formData.email,
          formData.cargo,
          formData.password || null
        );

        if (response.success) {
          setSuccess('Utilizador atualizado com sucesso!');
          setShowModal(false);
          loadUsers();
        }
      }
    } catch (err) {
      setError(err.message || 'Erro ao processar pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await api.deleteUser(selectedUser.id);
      
      if (response.success) {
        setSuccess('Utilizador excluído com sucesso!');
        setShowModal(false);
        loadUsers();
      }
    } catch (err) {
      setError(err.message || 'Erro ao excluir utilizador');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-xl font-bold text-gray-900">Gestão de Utilizadores</h1>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          + Novo Utilizador
        </button>
      </header>

      {/* Mensagens */}
      <main className="p-4">
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {error && !showModal && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Lista de Utilizadores */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N.º Funcionário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {utilizadores.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.numero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.cargo === 'Gestor' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.cargo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {modalMode === 'create' && 'Criar Novo Utilizador'}
              {modalMode === 'edit' && 'Editar Utilizador'}
              {modalMode === 'delete' && 'Excluir Utilizador'}
            </h2>

            {modalMode === 'delete' ? (
              <>
                <p className="text-gray-600 mb-6">
                  Tem a certeza que deseja excluir o utilizador <strong>{selectedUser?.nome}</strong> (N.º {selectedUser?.numero})?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    disabled={loading}
                  >
                    {loading ? 'A excluir...' : 'Excluir'}
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      N.º de Funcionário *
                    </label>
                    <input
                      type="text"
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      disabled={modalMode === 'edit'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo *
                    </label>
                    <select
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Tripulante">Tripulante</option>
                      <option value="Gestor">Gestor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password {modalMode === 'edit' && '(deixe em branco para manter)'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={modalMode === 'create'}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    disabled={loading}
                  >
                    {loading ? 'A guardar...' : modalMode === 'create' ? 'Criar' : 'Atualizar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

