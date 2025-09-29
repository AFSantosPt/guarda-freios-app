import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function GestaoHorariosPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const isTripulantePlus = user && user.tipo === 'Gestor';

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadMessage('');
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Simulação de upload e OCR
      setUploadMessage(`Ficheiro '${selectedFile.name}' carregado com sucesso! (Simulação de OCR)`);
      setSelectedFile(null);
    } else {
      setUploadMessage('Por favor, selecione um ficheiro para carregar.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 text-blue-600"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Gestão de Horários</h1>
      </header>

      <main className="p-4">
        {/* Seção de Visualização de Horários */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Visualização de Horários</h2>
          <p className="text-gray-700 mb-4">Aqui pode consultar os horários disponíveis em formato TXT ou PDF.</p>
          <div className="space-y-3">
            <a 
              href="/horario_28E.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-md text-center transition-colors duration-200"
            >
              Download Horário Carreira 28E (PDF)
            </a>
            <a 
              href="/horario_15E.txt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-md text-center transition-colors duration-200"
            >
              Download Horário Carreira 15E (TXT)
            </a>
          </div>
        </div>

        {/* Seção de Upload de Horários (Apenas para Gestor) */}
        {isTripulantePlus && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload de Novos Horários</h2>
            <p className="text-gray-700 mb-4">Gestor e Admin podem carregar ficheiros (PDF, imagem) para atualização de horários. O sistema usará OCR para converter imagens em texto pesquisável (simulado).</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="horario-file" className="block text-sm font-medium text-gray-700">Selecionar Ficheiro</label>
                <input
                  type="file"
                  id="horario-file"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <button
                onClick={handleUpload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-200"
              >
                Carregar Horário
              </button>
              {uploadMessage && (
                <p className="mt-3 text-sm text-center 
                  {uploadMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}"
                >
                  {uploadMessage}
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default GestaoHorariosPage;

