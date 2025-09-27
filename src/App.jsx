import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import DashboardPage from './pages/DashboardPage';
import OrdensServicoPage from './pages/OrdensServicoPage';
import DetalhesOrdemPage from './pages/DetalhesOrdemPage';
import CarreiraPage from './pages/CarreiraPage';
import ChatCarreiraPage from './pages/ChatCarreiraPage';
import GestaoAvariasPage from './pages/GestaoAvariasPage';
import GestaoHorariosPage from './pages/GestaoHorariosPage';
import PesquisaCarrosPage from './pages/PesquisaCarrosPage';
import UserManagementPage from './pages/UserManagementPage';
import ConsultarServicoPage from './pages/ConsultarServicoPage';
import './App.css';

// Context para autenticação
const AuthContext = createContext();
export { AuthContext };

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (numeroFuncionario) => {
    const userType = numeroFuncionario === '18001' ? 'Tripulante+' : 'Tripulante';
    setUser({ numero: numeroFuncionario, tipo: userType });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Componente para proteger rotas
function ProtectedRoute({ children, requireTripulantePlus = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  if (requireTripulantePlus && user.tipo !== 'Tripulante+') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">
            Esta funcionalidade está disponível apenas para utilizadores Tripulante+.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}

// Página Login (resumida para manter foco)
function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [funcionario, setFuncionario] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: funcionario, pass: password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        login(funcionario);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro a ligar à API:', error);
      alert('Erro no servidor. Tenta novamente mais tarde.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* formulário de login */}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={funcionario}
          onChange={(e) => setFuncionario(e.target.value)}
          placeholder="N.º de Funcionário"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

// App principal
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/ordens-servico" element={<ProtectedRoute><OrdensServicoPage /></ProtectedRoute>} />
          <Route path="/detalhes-ordem" element={<ProtectedRoute><DetalhesOrdemPage /></ProtectedRoute>} />
          <Route path="/carreira" element={<ProtectedRoute><CarreiraPage /></ProtectedRoute>} />
          <Route path="/chat-carreira" element={<ProtectedRoute><ChatCarreiraPage /></ProtectedRoute>} />
          <Route path="/consultar-servico" element={<ProtectedRoute><ConsultarServicoPage /></ProtectedRoute>} />
          <Route path="/gestao-avarias" element={<ProtectedRoute><GestaoAvariasPage /></ProtectedRoute>} />
          <Route path="/gestao-horarios" element={<ProtectedRoute><GestaoHorariosPage /></ProtectedRoute>} />
          <Route path="/pesquisa-carros" element={<ProtectedRoute><PesquisaCarrosPage /></ProtectedRoute>} />
          <Route path="/gestao-utilizadores" element={<ProtectedRoute requireTripulantePlus={true}><UserManagementPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
