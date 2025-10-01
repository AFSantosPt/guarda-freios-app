import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function ChatCarreiraPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const carreiraAtual = searchParams.get('carreira') || '28E';
  const CARREIRA_ROUTES = {
    '12E': '/carreira-12e',
    '15E': '/carreira-15e',
    '18E': '/carreira-18e',
    '24E': '/carreira-24e',
    '25E': '/carreira-25e',
    '28E': '/carreira-28e'
  };

  const criarMensagemBoasVindas = (carreira) => ({
    type: 'bot',
    text: `Olá! Sou o assistente de IA da Carreira ${carreira}. Posso ajudá-lo com informações sobre horários, paragens, interrupções e ordens de serviço desta carreira.`
  });

  const [messages, setMessages] = useState(() => [criarMensagemBoasVindas(carreiraAtual)]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCarreiraInfo = (carreira) => {
    const info = {
      '12E': {
        horario: 'A Carreira 12E funciona das 06:00 às 01:00, com frequência de 6-8 minutos.',
        paragens: 'Paragens principais: Martim Moniz, Socorro, Largo das Portas do Sol, Sé, Chiado e Praça Luís de Camões.',
        percurso: 'Percurso: Martim Moniz ↔ Praça Luís de Camões',
      },
      '15E': {
        horario: 'A Carreira 15E funciona das 06:30 às 00:30, com frequência de 8-10 minutos.',
        paragens: 'Paragens principais: Praça da Figueira, Cais do Sodré, Santos, Museu Nacional de Arte Antiga, Belém e Algés (Jardim).',
        percurso: 'Percurso: Praça da Figueira ↔ Algés (Jardim)',
      },
      '18E': {
        horario: 'A Carreira 18E funciona das 07:00 às 22:30, com frequência média de 10 minutos.',
        paragens: 'Paragens principais: Cais do Sodré, Santos, Museu Nacional de Arte Antiga, Palácio Nacional da Ajuda e Cemitério da Ajuda.',
        percurso: 'Percurso: Cais do Sodré ↔ Cemitério da Ajuda',
      },
      '24E': {
        horario: 'A Carreira 24E funciona das 07:00 às 20:30, com circulação reforçada nas horas de ponta.',
        paragens: 'Paragens principais: Campolide, Amoreiras, Largo do Rato, Príncipe Real, Chiado e Praça Luís de Camões.',
        percurso: 'Percurso: Campolide ↔ Praça Luís de Camões',
      },
      '25E': {
        horario: 'A Carreira 25E funciona das 06:30 às 21:30, com frequência de 10-12 minutos.',
        paragens: 'Paragens principais: Campo de Ourique (Prazeres), Basílica da Estrela, Assembleia da República, Chiado e Campo das Cebolas.',
        percurso: 'Percurso: Campo de Ourique (Prazeres) ↔ Campo das Cebolas',
      },
      '28E': {
        paragens: 'Paragens principais: Martim Moniz, Graça, Sé, Chiado, Estrela e Campo de Ourique (Prazeres).',
        percurso: 'Percurso circular: Martim Moniz → Graça → Baixa → Chiado → Estrela → Campo de Ourique (Prazeres) → Martim Moniz',
        percurso: 'Percurso circular: Martim Moniz → Campo de Ourique → Prazeres → Estrela → Graça → Martim Moniz',
      }
    };
    return info[carreira] || info['28E'];
  };

  useEffect(() => {
    setMessages([criarMensagemBoasVindas(carreiraAtual)]);
  }, [carreiraAtual]);

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (trimmedInput === '') return;


    setMessages((prevMessages) => [...prevMessages, { type: 'user', text: trimmedInput }]);
    setInput('');

    // Simular resposta do bot
    setTimeout(() => {
      let botResponse = 'Desculpe, não compreendi a sua pergunta. Pode reformular, por favor?';
      const lowerInput = trimmedInput.toLowerCase();
      const carreiraInfo = getCarreiraInfo(carreiraAtual);

      // Verificar se a pergunta é sobre outra carreira
      const outrasCarreiras = ['12E', '15E', '18E', '24E', '25E', '28E'].filter(c => c !== carreiraAtual);
      const mencionaOutraCarreira = outrasCarreiras.some(carreira => 
        lowerInput.includes(carreira.toLowerCase()) || lowerInput.includes(carreira)
      );

      if (mencionaOutraCarreira) {
        const carreiraDetectada = outrasCarreiras.find(carreira => 
          lowerInput.includes(carreira.toLowerCase()) || lowerInput.includes(carreira)
        );
        botResponse = `Esta pergunta parece ser sobre a Carreira ${carreiraDetectada}. Por favor, aceda à página da Carreira ${carreiraDetectada} para obter informações específicas sobre essa linha.`;
      } else if (lowerInput.includes('horário') || lowerInput.includes('horas') || lowerInput.includes('frequência')) {
        botResponse = carreiraInfo.horario;
      } else if (lowerInput.includes('paragens') || lowerInput.includes('paragem') || lowerInput.includes('estações')) {
        botResponse = carreiraInfo.paragens;
      } else if (lowerInput.includes('percurso') || lowerInput.includes('trajeto') || lowerInput.includes('trajecto')) {
        botResponse = carreiraInfo.percurso;
      } else if (lowerInput.includes('sentido') || lowerInput.includes('direcção') || lowerInput.includes('direção')) {
        if (carreiraAtual === '28E') {
          botResponse = 'O elétrico 28E tem um percurso circular. Neste momento, o veículo #123 está no sentido Martim Moniz → Campo de Ourique. Próxima paragem: R. Palma.';
        } else {
          botResponse = `A Carreira ${carreiraAtual} tem dois sentidos de circulação. Consulte o mapa da carreira para ver a localização atual dos veículos.`;
        }
      } else if (lowerInput.includes('interrupções') || lowerInput.includes('interrupção') || lowerInput.includes('obras')) {
        botResponse = `Neste momento, não há interrupções reportadas na Carreira ${carreiraAtual}. O serviço está a funcionar normalmente.`;
      } else if (lowerInput.includes('ordens de serviço') || lowerInput.includes('serviço') || lowerInput.includes('manutenção')) {
        botResponse = `Há uma ordem de serviço ativa para o veículo #550 da Carreira ${carreiraAtual} (verificação de sistema de travagem). Consulte a página de Ordens de Serviço para mais detalhes.`;
      } else if (lowerInput.includes('reportar avaria') || lowerInput.includes('avaria') || lowerInput.includes('problema')) {
        botResponse = 'Para reportar uma avaria, preciso de alguns dados. Qual é o número da chapa do veículo?';
        // Simular abertura de formulário após 2 segundos
        setTimeout(() => navigate('/gestao-avarias?report=true'), 2000);
      } else if (lowerInput.includes('veículo') || lowerInput.includes('veiculo') || lowerInput.includes('chapa')) {
        // Exemplo baseado nas suas instruções: veiculo 550, carreira 28E, chapa 5
        if (lowerInput.includes('550')) {
          botResponse = `O veículo 550 está afeto à Carreira ${carreiraAtual}/5. Este é um serviço de fins de semana com horário especial.`;
        } else {
          botResponse = `Por favor, indique o número do veículo para que possa fornecer informações específicas sobre a sua afetação na Carreira ${carreiraAtual}.`;
        }
      } else if (lowerInput.includes('fins de semana') || lowerInput.includes('sábado') || lowerInput.includes('domingo')) {
        botResponse = `Aos fins de semana, a Carreira ${carreiraAtual} tem frequência reduzida. O serviço funciona com intervalos de 12-15 minutos.`;
      }

      setMessages(prevMessages => [...prevMessages, { type: 'bot', text: botResponse }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button
          onClick={() => navigate(CARREIRA_ROUTES[carreiraAtual] || '/carreira-28e')}
          className="mr-4 p-2 text-blue-600"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Chat AI - Carreira {carreiraAtual}</h1>
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

