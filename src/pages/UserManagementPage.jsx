import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function UserManagementPage() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [numeroFuncionario, setNumeroFuncionario] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tipoUtilizador, setTipoUtilizador] = useState('Tripulante')
  const [utilizadores, setUtilizadores] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  // Carregar utilizadores ao montar o componente
  useEffect(() => {
    loadUtilizadores()
  }, [])

  const loadUtilizadores = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/users`)
      if (response.data.success) {
        setUtilizadores(response.data.users)
      }
    } catch (err) {
      console.error('Erro ao carregar utilizadores:', err)
      setError('Erro ao carregar lista de utilizadores')
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        numero: numeroFuncionario,
        nome: nome,
        email: email,
        cargo: tipoUtilizador,
        password: password
      })

      if (response.data.success) {
        setSuccess(`Utilizador ${nome} adicionado com sucesso!`)
        // Limpar formulário
        setNome('')
        setNumeroFuncionario('')
        setEmail('')
        setPassword('')
        setTipoUtilizador('Tripulante')
        // Recarregar lista de utilizadores
        await loadUtilizadores()
        
        // Limpar mensagem de sucesso após 5 segundos
        setTimeout(() => setSuccess(''), 5000)
      }
    } catch (err) {
      console.error('Erro ao adicionar utilizador:', err)
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Erro ao adicionar utilizador. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 text-blue-600"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Gestão de Utilizadores</h1>
      </header>

      <main className="p-4">
        {/* Mensagens de erro e sucesso */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Formulário para adicionar novo utilizador */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Novo Utilizador</h2>
          
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nome Completo (*)
              </label>
              <input
                type="text"
                placeholder="ex: André Santos"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                N.º de Funcionário (*)
              </label>
              <input
                type="text"
                placeholder="ex: 180xxx"
                value={numeroFuncionario}
                onChange={(e) => setNumeroFuncionario(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email (*)
              </label>
              <input
                type="email"
                placeholder="ex: exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password (*)
              </label>
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={6}
              />
              <p className="text-sm text-gray-500 mt-1">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tipo de Utilizador (*)
              </label>
              <select
                value={tipoUtilizador}
                onChange={(e) => setTipoUtilizador(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Tripulante">Tripulante</option>
                <option value="Gestor">Gestor</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'A adicionar...' : 'Adicionar Utilizador'}
            </button>
          </form>
        </div>

        {/* Lista de utilizadores existentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Utilizadores Existentes ({utilizadores.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {utilizadores.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                Nenhum utilizador encontrado
              </div>
            ) : (
              utilizadores.map((user) => (
                <div key={user.id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.nome}</p>
                    <p className="text-sm text-gray-600">N.º {user.numero}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.cargo === 'Gestor' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.cargo}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
