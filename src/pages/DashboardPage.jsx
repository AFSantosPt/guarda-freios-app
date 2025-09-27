import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Tram, 
  Wrench, 
  Clock, 
  Zap, 
  Home, 
  ClipboardList, 
  Route, 
  AlertTriangle, 
  Settings,
  Menu
} from 'lucide-react'

import { useNavigate, useLocation } from 'react-router-dom'

export default function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { 
      title: 'Ordens de Serviço', 
      icon: '📋', 
      onClick: () => navigate('/ordens-servico'),
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      iconColor: 'text-blue-600'
    },
    { 
      title: '28E', 
      icon: '🚋', 
      onClick: () => navigate('/carreira'),
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    { 
      title: '15E', 
      icon: '🚋', 
      onClick: () => navigate('/carreira'),
      bgColor: 'bg-green-50 hover:bg-green-100',
      iconColor: 'text-green-600'
    },
    { 
      title: 'Avarias', 
      icon: '🔧', 
      onClick: () => navigate('/pesquisa-carros'),
      bgColor: 'bg-red-50 hover:bg-red-100',
      iconColor: 'text-red-600'
    },
    { 
      title: 'Agenda', 
      icon: '🗓️', 
      onClick: () => navigate('/consultar-servico'), // 👉 agora vai para a tua nova página
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      iconColor: 'text-purple-600'
    },
    { 
      title: 'Elétrico & Serviço', 
      icon: '⚡', 
      onClick: () => navigate('/detalhes-ordem'),
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      iconColor: 'text-indigo-600'
    }
  ]

  const bottomNavItems = [
    { title: 'Início', icon: '🏠', rota: '/dashboard' },
    { title: 'Ordens', icon: '📋', rota: '/ordens-servico' },
    { title: 'Carreiras', icon: '🚋', rota: '/carreira' },
    { title: 'Avarias', icon: '⚠️', rota: '/gestao-avarias' },
    { title: 'Agenda', icon: '🗓️', rota: '/consultar-servico' }, // 👉 substitui Horários
    { title: 'Serviços', icon: '⚙️', rota: '/gestao-utilizadores' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 flex justify-between items-center">
  <h1 className="text-xl font-bold text-gray-900">Guarda-Freios</h1>
  <button className="text-blue-600 flex items-center">
    <span className="text-2xl">☰</span>
    <span className="ml-1">Menu</span>
  </button>
</header>


      {/* Main Content */}
      <main className="flex-1 p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Guarda-Freios</h2>
        
        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`${item.bgColor} border border-gray-200 p-6 h-auto flex flex-col items-center justify-center space-y-3 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md`}
            >
              <span className={`text-3xl ${item.iconColor}`}>{item.icon}</span>
              <span className="text-gray-900 font-medium text-center text-sm">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-between items-center">
          {bottomNavItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.rota)}
              className={`flex flex-col items-center py-2 px-1 rounded-lg transition-colors duration-200 ${
                location.pathname === item.rota
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.title}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

