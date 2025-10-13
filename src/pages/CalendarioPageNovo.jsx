import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../App';
import api from '../services/api';

const CalendarioPage = () => {
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddService, setShowAddService] = useState(false);
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    numero_servico: '',
    local_inicio: '',
    local_fim: '',
    hora_inicio: '',
    hora_fim: '',
    numero_chapa: '',
    afetacao: 'Normal'
  });

  // Carregar serviços do mês atual
  useEffect(() => {
    if (user) {
      loadServicos();
    }
  }, [currentMonth, user]);

  const loadServicos = async () => {
    try {
      const mes = currentMonth.getMonth() + 1;
      const ano = currentMonth.getFullYear();
      
      // TODO: Implementar chamada à API
      // const response = await api.getServicos(user.id, mes, ano);
      // Organizar serviços por data
      
    } catch (err) {
      console.error('Erro ao carregar serviços:', err);
    }
  };

  // Buscar auto-preenchimento quando o número do serviço muda
  const handleNumeroServicoChange = async (e) => {
    const numero = e.target.value;
    setFormData({ ...formData, numero_servico: numero });

    if (numero.length >= 3 && user) {
      try {
        // TODO: Implementar chamada à API de auto-preenchimento
        // const response = await api.getAutoPreenchimento(user.id, numero);
        // if (response.auto_preenchimento) {
        //   setFormData({
        //     ...formData,
        //     numero_servico: numero,
        //     ...response.dados
        //   });
        // }
      } catch (err) {
        console.error('Erro ao buscar auto-preenchimento:', err);
      }
    }
  };

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

  const isToday = (year, month, day) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implementar chamada à API
      // const response = await api.createServico({
      //   tripulante_id: user.id,
      //   data: selectedDate,
      //   ...formData
      // });

      setSuccess('Serviço adicionado com sucesso!');
      setShowAddService(false);
      setFormData({
        numero_servico: '',
        local_inicio: '',
        local_fim: '',
        hora_inicio: '',
        hora_fim: '',
        numero_chapa: '',
        afetacao: 'Normal'
      });
      loadServicos();
    } catch (err) {
      setError(err.message || 'Erro ao adicionar serviço');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (servicoId) => {
    if (!confirm('Tem a certeza que deseja excluir este serviço?')) {
      return;
    }

    try {
      // TODO: Implementar chamada à API
      // await api.deleteServico(servicoId, user.id);
      setSuccess('Serviço excluído com sucesso!');
      loadServicos();
    } catch (err) {
      setError(err.message || 'Erro ao excluir serviço');
    }
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

          {/* Mensagens */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Calendário */}
          <div className="bg-white">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => navigateMonth(-1)}
                className="text-gray-600 hover:text-gray-800 text-2xl"
              >
                ‹
              </button>
              <h2 className="text-lg font-semibold">
                {monthNames[currentMonth.getMonth()]} de {currentMonth.getFullYear()}
              </h2>
              <button 
                onClick={() => navigateMonth(1)}
                className="text-gray-600 hover:text-gray-800 text-2xl"
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
                const isTodayDate = day && isToday(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                
                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className={`
                      h-12 w-12 rounded-full flex items-center justify-center text-sm relative
                      ${!day ? 'invisible' : ''}
                      ${isSelected ? 'bg-yellow-400 text-black font-bold' : ''}
                      ${hasServices && !isSelected ? 'bg-blue-100 text-blue-800' : ''}
                      ${!hasServices && !isSelected && !isTodayDate ? 'text-gray-600 hover:bg-gray-100' : ''}
                      ${isTodayDate && !isSelected ? 'bg-green-100 text-green-800 font-bold ring-2 ring-green-400' : ''}
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
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border relative">
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-xl"
                      title="Excluir serviço"
                    >
                      🗑️
                    </button>
                    
                    <div className="flex items-center justify-between mb-2 pr-8">
                      <h3 className="font-bold text-blue-600">Serviço: {service.numero_servico}</h3>
                      <span className="text-sm text-gray-500">Parte {index + 1}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Local Início → Final</p>
                        <p className="font-medium">{service.local_inicio} → {service.local_fim}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Horário</p>
                        <p className="font-medium">{service.hora_inicio} → {service.hora_fim}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">N.º Chapa</p>
                        <p className="font-medium">{service.numero_chapa}</p>
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
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nº do Serviço *
                  </label>
                  <input
                    type="text"
                    value={formData.numero_servico}
                    onChange={handleNumeroServicoChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Ex: 0123"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-preenchimento após 5 registos iguais
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Local Início *
                  </label>
                  <input
                    type="text"
                    value={formData.local_inicio}
                    onChange={(e) => setFormData({ ...formData, local_inicio: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Ex: Martim Moniz"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Local Fim *
                  </label>
                  <input
                    type="text"
                    value={formData.local_fim}
                    onChange={(e) => setFormData({ ...formData, local_fim: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Ex: Estrela"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora Início *
                    </label>
                    <input
                      type="time"
                      value={formData.hora_inicio}
                      onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora Fim *
                    </label>
                    <input
                      type="time"
                      value={formData.hora_fim}
                      onChange={(e) => setFormData({ ...formData, hora_fim: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    N.º Chapa *
                  </label>
                  <input
                    type="text"
                    value={formData.numero_chapa}
                    onChange={(e) => setFormData({ ...formData, numero_chapa: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Ex: 28E/01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Afetação *
                  </label>
                  <select 
                    value={formData.afetacao}
                    onChange={(e) => setFormData({ ...formData, afetacao: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
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
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'A guardar...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarioPage;

