import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'

export default function LoginPage() {
  const [funcionario, setFuncionario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  // Base de dados simulada de utilizadores
  const usuarios = {
    '18001': { password: '123456', nome: 'João Silva', cargo: 'Gestor' },
    '18002': { password: '123456', nome: 'Maria Santos', cargo: 'Tripulante' },
    '180939': { password: 'andres91', nome: 'André Santos', cargo: 'Gestor' }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500))

    // Validar credenciais
    const usuario = usuarios[funcionario]
    
    if (!usuario) {
      setError('Número de funcionário não encontrado')
      setLoading(false)
      return
    }

    if (usuario.password !== password) {
      setError('Password incorreta')
      setLoading(false)
      return
    }

    // Login bem-sucedido
    const userData = {
      numero: funcionario,
      nome: usuario.nome,
      cargo: usuario.cargo
    }

    login(userData)
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-yellow-500 mr-1"></div>
              <div className="w-8 h-8 rounded-full bg-gray-600"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Guarda-Freios</h1>
          <p className="text-gray-600">Entrar na sua conta</p>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="funcionario" className="block text-gray-700 font-medium mb-2">
              N.º de Funcionário
            </label>
            <input
              id="funcionario"
              type="text"
              placeholder="ex: 180xxx"
              value={funcionario}
              onChange={(e) => setFuncionario(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-yellow-500 hover:bg-yellow-600 text-black'
            }`}
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        {/* Link para registo */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem conta?{' '}
            <button
              onClick={() => navigate('/registo')}
              className="text-yellow-600 hover:text-yellow-700 font-semibold underline"
            >
              Criar conta
            </button>
          </p>
        </div>

        {/* Informação de teste */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800 font-semibold mb-2">Credenciais de teste:</p>
          <p className="text-xs text-blue-700">Funcionário: 18001 | Password: 123456 (Gestor)</p>
          <p className="text-xs text-blue-700">Funcionário: 18002 | Password: 123456 (Tripulante)</p>
        </div>
      </div>
    </div>
  )
}
