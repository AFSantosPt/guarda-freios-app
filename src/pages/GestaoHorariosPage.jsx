import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function CalendarGrid({ onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [...Array(daysInMonth).keys()].map(d => d + 1);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="px-3 py-1 bg-gray-200 rounded">←</button>
        <h2 className="text-lg font-bold">
          {currentDate.toLocaleString("pt-PT", { month: "long", year: "numeric" })}
        </h2>
        <button onClick={handleNextMonth} className="px-3 py-1 bg-gray-200 rounded">→</button>
      </div>

      {/* Cabeçalho dos dias da semana */}
      <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* Dias */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {[...Array(firstDay).keys()].map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {daysArray.map((day) => (
          <div
            key={day}
            className="p-2 cursor-pointer hover:bg-blue-100 rounded-lg"
            onClick={() => onSelectDate(new Date(year, month, day))}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

function GestaoHorariosPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const isTripulantePlus = user && user.tipo === 'Tripulante+';

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadMessage('');
  };

const handleUpload = () => {
  if (selectedFile) {
    const fileName = selectedFile.name; // guarda o nome antes
    setUploadMessage(`Ficheiro '${fileName}' carregado com sucesso! (Simulação de OCR)`);
    setSelectedFile(null); // agora já podes limpar
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
        {/* Calendário */}
        <CalendarGrid onSelectDate={setSelectedDate} />

        {selectedDate && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Serviços em {selectedDate.toLocaleDateString("pt-PT")}
            </h2>
            <p className="text-gray-600">Aqui vai aparecer a lista de serviços desse dia.</p>
          </div>
        )}

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

        {/* Seção de Upload de Horários (Apenas para Tripulante+) */}
        {isTripulantePlus && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload de Novos Horários</h2>
            <p className="text-gray-700 mb-4">
              Tripulante+ e Admin podem carregar ficheiros (PDF, imagem) para atualização de horários.
              O sistema usará OCR para converter imagens em texto pesquisável (simulado).
            </p>
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
                <p className={`mt-3 text-sm text-center ${uploadMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
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
