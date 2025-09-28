import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';

const CalendarioPage = () => {
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddService, setShowAddService] = useState(false);
  const [services, setServices] = useState({
    '2025-09-22': [
      {
        id: '0123',
        localInicio: 'Martim Moniz',
        localFim: 'Estrela',
        horaInicio: '13:37',
        horaFim: '21:07',
        viatura: '28E/01',
        afetacao: 'Normal'
      },
      {
        id: 'S1899P2',
        localInicio: 'Estrela',
        localFim: 'Sto. Amaro (Est.)',
        horaInicio: '21:07',
        horaFim: '26:05',
        viatura: '28E/01#/',
        afetacao: 'Extra Normal - Tipo2'
      }
    ],
    '2025-09-29': [
      {
        id: 'E2466',
        localInicio: 'Calvário',
        localFim: 'Sto. Amaro (Est.)',
        horaInicio: '16:40',
        horaFim: '24:09',
        viatura: '15E/06',
        afetacao: 'Normal'
      }
    ]
  });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Adicionar dias vazios para o início do mês
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Adicionar todos os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleDateClick = (day) => {
    if (day) {
      const dateKey = formatDateKey(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      setSelectedDate(dateKey);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const selectedServices = selectedDate ? services[selectedDate] || [] : [];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => window.history.back()}
              className="text-blue-600 text-2xl"
            >
              ←
            </button>
            <h1 className="text-xl font-bold text-gray-800">Calendário de Serviços</h1>
            <div className="w-8"></div>
          </div>

          {/* Calendário */}
          <div className="bg-white">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => navigateMonth(-1)}
                className="text-gray-600 hover:text-gray-800"
              >
                ‹
              </button>
              <h2 className="text-lg font-semibold">
                {monthNames[currentMonth.getMonth()]} de {currentMonth.getFullYear()}
              </h2>
              <button 
                onClick={() => navigateMonth(1)}
                className="text-gray-600 hover:text-gray-800"
              >
                ›
              </button>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day, index) => (
                <div key={index} className="text-center text-gray-500 font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Dias do mês */}
            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentMonth).map((day, index) => {
                const dateKey = day ? formatDateKey(currentMonth.getFullYear(), currentMonth.getMonth(), day) : null;
                const hasServices = dateKey && services[dateKey];
                const isSelected = dateKey === selectedDate;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className={`
                      h-12 w-12 rounded-full flex items-center justify-center text-sm
                      ${!day ? 'invisible' : ''}
                      ${isSelected ? 'bg-yellow-400 text-black font-bold' : ''}
                      ${hasServices && !isSelected ? 'bg-blue-100 text-blue-800' : ''}
                      ${!hasServices && !isSelected ? 'text-gray-600 hover:bg-gray-100' : ''}
                    `}
                    disabled={!day}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lista de Serviços do Dia Selecionado */}
        {selectedDate && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Serviços do dia {selectedDate.split('-').reverse().join('/')}
              </h2>
              <button
                onClick={() => setShowAddService(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                ➕ Adicionar Serviço
              </button>
            </div>

            {selectedServices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum serviço registado para este dia
              </p>
            ) : (
              <div className="space-y-4">
                {selectedServices.map((service, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-blue-600">Serviço: {service.id}</h3>
                      <span className="text-sm text-gray-500">Parte {index + 1}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Local Início → Final</p>
                        <p className="font-medium">{service.localInicio} → {service.localFim}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Horário</p>
                        <p className="font-medium">{service.horaInicio} → {service.horaFim}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Viatura</p>
                        <p className="font-medium">{service.viatura}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Afetação</p>
                        <p className="font-medium">{service.afetacao}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Formulário de Adicionar Serviço */}
        {showAddService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Adicionar Serviço</h3>
                <button
                  onClick={() => setShowAddService(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nº do Serviço
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Ex: 0123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Local Início
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Ex: Martim Moniz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Local Fim
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Ex: Estrela"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora Início
                    </label>
                    <input
                      type="time"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora Fim
                    </label>
                    <input
                      type="time"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Viatura
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Ex: 28E/01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Afetação
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="Normal">Normal</option>
                    <option value="Extra Normal">Extra Normal</option>
                    <option value="Extra Normal - Tipo2">Extra Normal - Tipo2</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddService(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Gestão Extra para Tripulante+ */}
        {user?.tipo === 'Tripulante+' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Gestão Extra (Tripulante+)</h2>
            
            {/* Upload de Chapas */}
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-700 mb-3">Upload de Chapas</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="upload-chapas"
                />
                <label
                  htmlFor="upload-chapas"
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  📁 Clique para fazer upload das chapas
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Suporta múltiplas imagens (PNG, JPG)
                </p>
              </div>
            </div>

            {/* Gestão de Partes de Serviço */}
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-3">Gestão de Partes de Serviço</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nº Serviço (Auto-preenchimento)
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Digite o nº do serviço"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carreira
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option value="">Selecione...</option>
                      <option value="12E">12E</option>
                      <option value="15E">15E</option>
                      <option value="18E">18E</option>
                      <option value="24E">24E</option>
                      <option value="25E">25E</option>
                      <option value="28E">28E</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Local Início
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Local Fim
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Início
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Fim
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chapa
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Ex: 6"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Afetação
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Selecione...</option>
                    <option value="Normal">Normal</option>
                    <option value="Extra Normal">Extra Normal</option>
                    <option value="Extra Normal - Tipo2">Extra Normal - Tipo2</option>
                    <option value="Entrada"># Entrada</option>
                    <option value="Saida"># Saída</option>
                  </select>
                </div>

                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  💾 Gravar Serviço
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarioPage;

