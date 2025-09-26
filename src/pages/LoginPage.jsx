import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [funcionario, setFuncionario] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    // Simular login e navegar para o dashboard
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

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="funcionario" className="text-gray-700 font-medium">
              N.º de Funcionário
            </Label>
            <Input
              id="funcionario"
              type="text"
              placeholder="ex: 180xxx"
              value={funcionario}
              onChange={(e) => setFuncionario(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}

