import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const MudarPasswordPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [passwordAtual, setPasswordAtual] = useState('');
  const [novaPassword, setNovaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mostrarPasswords, setMostrarPasswords] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState(''); // 'sucesso' ou 'erro'

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validações
    if (!passwordAtual || !novaPassword || !confirmarPassword) {
      setMensagem('Por favor, preencha todos os campos.');
      setTipoMensagem('erro');
      return;
    }

    if (novaPassword !== confirmarPassword) {
      setMensagem('A nova password e a confirmação não coincidem.');
      setTipoMensagem('erro');
      return;
    }

    if (novaPassword.length < 6) {
      setMensagem('A nova password deve ter pelo menos 6 caracteres.');
      setTipoMensagem('erro');
      return;
    }

    if (passwordAtual === novaPassword) {
      setMensagem('A nova password deve ser diferente da password atual.');
      setTipoMensagem('erro');
      return;
    }

    // Simular validação da password atual
    // Em uma aplicação real, isso seria validado no backend
    if (passwordAtual !== '123456') { // Simulação - assumindo que a password atual é sempre '123456'
      setMensagem('A password atual está incorreta.');
      setTipoMensagem('erro');
      return;
    }

    // Simular alteração da password
    // Em uma aplicação real, isso seria enviado para o backend
    setTimeout(() => {
      setMensagem('Password alterada com sucesso!');
      setTipoMensagem('sucesso');
      
      // Limpar os campos após sucesso
      setPasswordAtual('');
      setNovaPassword('');
      setConfirmarPassword('');
      
      // Redirecionar para o dashboard após 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 1000);
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
        <h1 className="text-xl font-bold text-gray-900">Mudar Password</h1>
      </header>

      <main className="p-4">
        <div className="max-w-md mx-auto">
          {/* Informações do utilizador */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Utilizador</h2>
            <p className="text-gray-600">N.º: {user?.numero}</p>
            <p className="text-gray-600">Tipo: {user?.tipo}</p>
          </div>

          {/* Formulário de alteração de password */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alterar Password</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Password Atual */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Password Atual
                </label>
                <input
                  type={mostrarPasswords ? "text" : "password"}
                  value={passwordAtual}
                  onChange={(e) => setPasswordAtual(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Introduza a password atual"
                  required
                />
              </div>

              {/* Nova Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Nova Password
                </label>
                <input
                  type={mostrarPasswords ? "text" : "password"}
                  value={novaPassword}
                  onChange={(e) => setNovaPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Introduza a nova password"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo de 6 caracteres
                </p>
              </div>

              {/* Confirmar Nova Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Confirmar Nova Password
                </label>
                <input
                  type={mostrarPasswords ? "text" : "password"}
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirme a nova password"
                  required
                />
              </div>

              {/* Mostrar/Ocultar Passwords */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="mostrarPasswords"
                  checked={mostrarPasswords}
                  onChange={(e) => setMostrarPasswords(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="mostrarPasswords" className="text-sm text-gray-600">
                  Mostrar passwords
                </label>
              </div>

              {/* Mensagem de feedback */}
              {mensagem && (
                <div className={`p-3 rounded-lg text-sm ${
                  tipoMensagem === 'sucesso' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {mensagem}
                </div>
              )}

              {/* Botões */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Alterar Password
                </button>
              </div>
            </form>
          </div>

          {/* Dicas de segurança */}
          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Dicas de Segurança</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Use uma password forte com pelo menos 8 caracteres</li>
              <li>• Inclua letras maiúsculas, minúsculas, números e símbolos</li>
              <li>• Não partilhe a sua password com ninguém</li>
              <li>• Altere a password regularmente</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MudarPasswordPage;

