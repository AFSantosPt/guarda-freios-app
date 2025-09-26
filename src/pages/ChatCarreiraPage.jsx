import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatCarreiraPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Olá! Sou o seu assistente de IA para a Carreira 28E. Como posso ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { type: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Simular resposta do bot
    setTimeout(() => {
      let botResponse = 'Desculpe, não entendi a sua pergunta. Pode reformular?';
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('horário') || lowerInput.includes('horas')) {
        botResponse = 'O elétrico 28E funciona das 06:00 às 23:30, com frequência de 8-12 minutos.';
      } else if (lowerInput.includes('paragens') || lowerInput.includes('paragem')) {
        botResponse = 'As principais paragens da Carreira 28E incluem Martim Moniz, Graça, Estrela e Prazeres.';
      } else if (lowerInput.includes('sentido')) {
        botResponse = 'O elétrico 28E tem um percurso circular. No momento, o veículo #123 está no sentido Martim Moniz -> Campo de Ourique. Próxima paragem: R. Palma.';
      } else if (lowerInput.includes('interrupções') || lowerInput.includes('interrupção')) {
        botResponse = 'Sim, há uma circulação condicionada entre Graça e Voz Operário devido a obras. Autocarros de substituição estão disponíveis.';
      } else if (lowerInput.includes('ordens de serviço') || lowerInput.includes('serviço')) {
        botResponse = 'Sim, há uma ordem de serviço ativa para o elétrico #500 (Iluminação interior fraca). Consulte a página de Ordens de Serviço para mais detalhes.';
      } else if (lowerInput.includes('reportar avaria') || lowerInput.includes('avaria')) {
        botResponse = 'Para reportar uma avaria, por favor, preencha o formulário de reporte de avarias. Qual a chapa do elétrico?';
        // Simular abertura de formulário
        setTimeout(() => navigate('/gestao-avarias?report=true'), 1500);
      }

      setMessages(prevMessages => [...prevMessages, { type: 'bot', text: botResponse }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button 
          onClick={() => navigate('/carreira')}
          className="mr-4 p-2 text-blue-600"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Chat AI - Carreira 28E</h1>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <div className="bg-white border-t border-gray-200 p-4 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
          placeholder="Digite a sua mensagem..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSend}
          className="ml-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default ChatCarreiraPage;

