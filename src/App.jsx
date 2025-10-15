import React from 'react'
import "leaflet/dist/leaflet.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import RegistoPage from './pages/RegistoPage';
import GestaoAvariasPage from './pages/GestaoAvariasPage';
import GestaoHorariosPage from './pages/GestaoHorariosPage';
import GestaoUtilizadoresPage from './pages/GestaoUtilizadoresPage';
import CalendarioPage from './pages/CalendarioPage';
import Carreira12EPage from './pages/Carreira12EPage';
import Carreira15EPage from './pages/Carreira15EPage';
import Carreira18EPage from './pages/Carreira18EPage';
import Carreira24EPage from './pages/Carreira24EPage';
import Carreira25EPage from './pages/Carreira25EPage';
import Carreira28EPage from './pages/Carreira28EPage';
import ChatCarreiraPage from './pages/ChatCarreiraPage';
import MudarPasswordPage from './pages/MudarPasswordPage';
import { useState, createContext, useContext } from 'react'
import './App.css'

// Context para autenticação
const AuthContext = createContext()

// Exportar o contexto para uso nas páginas
export { AuthContext }

// Hook para usar o contexto de autenticação
const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Provider de autenticação
function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (userData) => {
    // userData deve conter: { numero, nome, cargo }
    setUser({
      numero: userData.numero,
      nome: userData.nome,
      tipo: userData.cargo // Mapear cargo para tipo
    })
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Página Dashboard
function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { title: 'Ordens de Serviço', onClick: () => navigate('/ordens-servico'), icon: '📋' },
    { title: '12E', onClick: () => navigate('/carreira-12e'), icon: '🚋' },
    { title: '15E', onClick: () => navigate('/carreira-15e'), icon: '🚋' },
    { title: '18E', onClick: () => navigate('/carreira-18e'), icon: '🚋' },
    { title: '24E', onClick: () => navigate('/carreira-24e'), icon: '🚋' },
    { title: '25E', onClick: () => navigate('/carreira-25e'), icon: '🚋' },
    { title: '28E', onClick: () => navigate('/carreira-28e'), icon: '🚋' },
    { title: 'Avarias', onClick: () => navigate('/gestao-avarias'), icon: '🔧' },
    { title: 'Horários', onClick: () => navigate('/gestao-horarios'), icon: '🕐' },
    { title: 'Calendário', onClick: () => navigate('/calendario'), icon: '📅' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Guarda-Freios</h1>
          {user && (
            <p className="text-sm text-gray-600">
              {user.numero} - {user.tipo}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate('/mudar-password')}
            className="text-green-600 font-medium text-sm"
          >
            Mudar Password
          </button>
          {user?.tipo === 'Gestor' && (
            <button 
              onClick={() => navigate('/gestao-utilizadores')}
              className="text-blue-600 font-medium text-sm"
            >
              Gestão
            </button>
          )}
          <button 
            onClick={logout}
            className="text-red-600 font-medium text-sm"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Guarda-Freios</h2>
        
        <div className="grid grid-cols-2 gap-3 mb-8">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center space-y-2"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-gray-900 font-medium text-center text-xs">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </main>

          <nav className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-between items-center">
          {["Início", "Ordens", "Avarias", "Horários", "Calendário"].map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (item === "Início") navigate("/dashboard");
                else if (item === "Ordens") navigate("/ordens-servico");
                else if (item === "Avarias") navigate("/gestao-avarias");
                else if (item === "Horários") navigate("/gestao-horarios");
                else if (item === "Calendário") navigate("/calendario");
              }}
              className={`flex flex-col items-center py-2 px-1 rounded-lg transition-colors duration-200 ${
                index === 0 ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-lg mb-1">
                {index === 0 ? '🏠' : index === 1 ? '📋' : index === 2 ? '⚠️' : index === 3 ? '🕐' : index === 4 ? '📅' : ''}
              </span>
              <span className="text-xs font-medium">{item}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

const iniciarPartilhaGPS = () => {
  watchIdRef.current = navigator.geolocation.watchPosition(
    (position) => {
      const novaLocalizacao = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date()
      };
      
      setMinhaLocalizacao(novaLocalizacao);
      
      // TODO: Enviar para backend
      // API.post('/api/gps/update', { ...novaLocalizacao, carreira: '12E' })
    },
    (error) => {
      setErroGPS("Erro ao obter localização: " + error.message);
      setPartilharGPS(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
};



// Página Ordens de Serviço
function OrdensServicoPage() {
  const navigate = useNavigate()

  const ordens = [
    { id: 1, assunto: 'Assunto 1', duracao: '30 min' },
    { id: 2, assunto: 'Assunto 2', duracao: '45 min' },
    { id: 3, assunto: 'Assunto 3', duracao: '1 h' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 text-blue-600"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Ordens de Serviço</h1>
      </header>

      <main className="p-4">
        <div className="space-y-4">
          {ordens.map((ordem) => (
            <div
              key={ordem.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {ordem.assunto}
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm">🕐 {ordem.duracao}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/detalhes-ordem')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <span className="text-gray-600 text-sm">1 de 1</span>
        </div>
      </main>
    </div>
  )
}

// Página Detalhes da Ordem
function DetalhesOrdemPage() {
  const navigate = useNavigate()
  const [numeroEletrico, setNumeroEletrico] = useState('500')

  const assuntos = [
    { id: 1, descricao: 'Iluminação interior fraca', tempo: '00:10' },
    { id: 2, descricao: 'Porta não abre', tempo: '00:17' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 text-blue-600"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Elétrico & Serviço</h1>
      </header>

      <main className="p-4">
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            N.º do Elétrico
          </label>
          <input
            type="text"
            value={numeroEletrico}
            onChange={(e) => setNumeroEletrico(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        <div className="space-y-4">
          {assuntos.map((assunto) => (
            <div
              key={assunto.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    Assunto
                  </h3>
                  <p className="text-gray-700 mb-2">{assunto.descricao}</p>
                </div>
                <div className="flex items-center text-gray-600 ml-4">
                  <span className="text-sm font-mono">🕐 {assunto.tempo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <span className="text-gray-600 text-sm">1 / 1</span>
        </div>
      </main>
    </div>
  )
}

// Página Carreira
function CarreiraPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 text-blue-600"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Carreira 28E</h1>
      </header>

      <main className="p-4">
        {/* Mapa da Carreira */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Mapa em Tempo Real</h2>
          <div className="flex justify-center">
            <img 
              src="/mapa_carreira_28e.png" 
              alt="Mapa da Carreira 28E" 
              className="w-full max-w-sm h-auto rounded-lg"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              🚋 Elétricos ativos: 2 | Última atualização: {new Date().toLocaleTimeString('pt-PT')}
            </p>
          </div>
        </div>

        {/* Informações da Carreira */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações da Linha</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Frequência:</span>
              <span className="font-medium">8-12 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Horário:</span>
              <span className="font-medium">06:00 - 23:30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Percurso:</span>
              <span className="font-medium">Circular</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duração:</span>
              <span className="font-medium">~45 min</span>
            </div>
          </div>
        </div>

        {/* Botão para Chat AI */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <button 
            onClick={() => navigate('/chat-carreira')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span className="mr-2">💬</span>
            Chat AI - Carreira 28E
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Pergunte sobre horários, paragens, avisos e ordens de serviço
          </p>
        </div>
      </main>
    </div>
  )
}

// Página Pesquisa de Carros
function PesquisaCarrosPage() {
  const navigate = useNavigate()
  const [pesquisa, setPesquisa] = useState('')

  const carros = [
    { numero: '501', estado: 'Pendente', cor: 'text-orange-600' },
    { numero: '523', estado: 'Resolvida', cor: 'text-green-600' },
    { numero: '542', estado: 'Pendente', cor: 'text-orange-600' },
    { numero: '586', estado: 'Resolvida', cor: 'text-green-600' }
  ]

  const carrosFiltrados = carros.filter(carro => 
    carro.numero.includes(pesquisa) || pesquisa === ''
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 text-blue-600"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Pesquisa de Carros</h1>
      </header>

      <main className="p-4">
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="N.º do Carro"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {carrosFiltrados.map((carro, index) => (
            <div
              key={carro.numero}
              className={`flex justify-between items-center p-4 ${
                index !== carrosFiltrados.length - 1 ? 'border-b border-gray-200' : ''
              } hover:bg-gray-50 transition-colors duration-200`}
            >
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-600 mr-4">
                  {carro.numero}
                </span>
              </div>
              <div className="flex items-center">
                <span className={`font-medium ${carro.cor}`}>
                  {carro.estado}
                </span>
              </div>
            </div>
          ))}
          
          {carrosFiltrados.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>Nenhum carro encontrado</p>
            </div>
          )}
        </div>

        {carrosFiltrados.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Mostrando {carrosFiltrados.length} resultado{carrosFiltrados.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </main>
    </div>
  )
}

// Página de Gestão de Utilizadores (apenas para Tripulante+)
function UserManagementPage() {
  const navigate = useNavigate()
  const [numeroFuncionario, setNumeroFuncionario] = useState('')
  const [password, setPassword] = useState('')
  const [tipoUtilizador, setTipoUtilizador] = useState('Tripulante')
  const [utilizadores, setUtilizadores] = useState([
    { id: 1, numero: '18001', tipo: 'Tripulante+' },
    { id: 2, numero: '18002', tipo: 'Tripulante' },
    { id: 3, numero: '18003', tipo: 'Tripulante' }
  ])

  const handleAddUser = (e) => {
    e.preventDefault()
    if (numeroFuncionario && password) {
      const newUser = {
        id: utilizadores.length + 1,
        numero: numeroFuncionario,
        tipo: tipoUtilizador
      }
      setUtilizadores([...utilizadores, newUser])
      setNumeroFuncionario('')
      setPassword('')
      setTipoUtilizador('Tripulante')
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
        {/* Formulário para adicionar novo utilizador */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Novo Utilizador</h2>
          
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                N.º de Funcionário
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
                Password
              </label>
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tipo de Utilizador
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Adicionar Utilizador
            </button>
          </form>
        </div>

        {/* Lista de utilizadores existentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Utilizadores Existentes</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {utilizadores.map((user) => (
              <div key={user.id} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">N.º {user.numero}</p>
                  <p className="text-sm text-gray-600">{user.tipo}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.tipo === 'Gestor' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.tipo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

// Componente para proteger rotas que requerem Tripulante+
function ProtectedRoute({ children, requireTripulantePlus = false }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate('/')
    return null
  }

  if (requireTripulantePlus && user.tipo !== 'Gestor') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">
            Esta funcionalidade está disponível apenas para utilizadores Gestor.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  return children
}

// Página Consultar Serviço
function ConsultarServicoPage() {
  const navigate = useNavigate()
  
  const servicos = [
    {
      id: 1,
      numero: '0123',
      data: '22/09/2025',
      inicio: { local: 'Martim Moniz', hora: '13:37' },
      fim: { local: 'Estrela', hora: '21:07' },
      viatura: '28E/01',
      afetacao: 'Normal'
    },
    {
      id: 2,
      numero: 'S1899P2',
      data: '22/09/2025',
      inicio: { local: 'Estrela', hora: '21:07' },
      fim: { local: 'Sto. Amaro (Est.)', hora: '26:05' },
      viatura: '28E/01#/',
      afetacao: 'Extra Normal - Tipo2'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white px-4 py-4 flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 text-white"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">Consultar Serviço: 22/09/2025</h1>
      </header>

      <main className="p-0">
        {servicos.map((servico, index) => (
          <div key={servico.id} className={`p-6 ${index > 0 ? 'border-t-8 border-gray-300' : ''}`} 
               style={{ backgroundColor: index === 0 ? '#e8f4fd' : '#f0f0f0' }}>
            
            {/* Cabeçalho do Serviço */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-blue-600 mb-2">
                Serviço: {servico.numero}
              </h2>
            </div>

            {/* Informações do Serviço */}
            <div className="grid grid-cols-2 gap-6">
              {/* Coluna Esquerda */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-600">{servico.inicio.local}</p>
                  <p className="text-2xl font-bold text-gray-900">{servico.inicio.hora}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-medium">Serviço de Viatura:</p>
                  <p className="text-lg font-bold text-blue-600">{servico.viatura}</p>
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-600">{servico.fim.local}</p>
                  <p className="text-2xl font-bold text-gray-900">{servico.fim.hora}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-medium">Tipo de Afetação:</p>
                  <p className="text-lg font-bold text-blue-600">{servico.afetacao}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Botão Ver Detalhes */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-600 p-4">
        <button 
          onClick={() => navigate('/detalhes-ordem')}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-4 rounded-lg text-lg transition-colors duration-200"
        >
          VER DETALHES
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/registo" element={<RegistoPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/ordens-servico" element={
              <ProtectedRoute>
                <OrdensServicoPage />
              </ProtectedRoute>
            } />
            <Route path="/detalhes-ordem" element={
              <ProtectedRoute>
                <DetalhesOrdemPage />
              </ProtectedRoute>
            } />
            <Route path="/carreira" element={
              <ProtectedRoute>
                <CarreiraPage />
              </ProtectedRoute>
            } />
            <Route path="/chat-carreira" element={
              <ProtectedRoute>
                <ChatCarreiraPage />
              </ProtectedRoute>
            } />
           <Route path="/consultar-servico" element={<ConsultarServicoPage />} />
           <Route path="/calendario" element={<CalendarioPage />} />
           <Route path="/carreira-12e" element={<Carreira12EPage />} />
           <Route path="/carreira-15e" element={<Carreira15EPage />} />
           <Route path="/carreira-18e" element={<Carreira18EPage />} />
           <Route path="/carreira-24e" element={<Carreira24EPage />} />
           <Route path="/carreira-25e" element={<Carreira25EPage />} />
           <Route path="/carreira-28e" element={<Carreira28EPage />} />
           <Route path="/mudar-password" element={
             <ProtectedRoute>
               <MudarPasswordPage />
             </ProtectedRoute>
           } />
          <Route path="/gestao-avarias" element={<GestaoAvariasPage />} />
          <Route path="/gestao-horarios" element={<GestaoHorariosPage />} />
            <Route path="/pesquisa-carros" element={
              <ProtectedRoute>
                <PesquisaCarrosPage />
              </ProtectedRoute>
            } />
            <Route path="/gestao-utilizadores" element={
              <ProtectedRoute requireTripulantePlus={true}>
                <GestaoUtilizadoresPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

