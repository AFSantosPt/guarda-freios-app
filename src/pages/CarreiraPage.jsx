import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, TramFront, AlertCircle, Clock, MapPin, Activity } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

const HORA_FORMATTER = new Intl.DateTimeFormat('pt-PT', {
  hour: '2-digit',
  minute: '2-digit'
})

const TIPO_OBSERVACAO_CLASSES = {
  alerta: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  operacao: 'bg-amber-100 text-amber-700',
  nota: 'bg-gray-100 text-gray-600'
}

const METRICAS = [
  {
    titulo: 'Elétricos em circulação',
    valor: '3',
    detalhe: 'Última atualização às 14:32',
    icon: TramFront,
    iconBg: 'bg-yellow-100 text-yellow-700'
  },
  {
    titulo: 'Pontualidade média',
    valor: '87% ',
    detalhe: '+5% vs. período anterior',
    icon: Activity,
    iconBg: 'bg-green-100 text-green-700'
  },
  {
    titulo: 'Ocorrências ativas',
    valor: '1',
    detalhe: 'Intervenção em acompanhamento',
    icon: AlertCircle,
    iconBg: 'bg-red-100 text-red-700'
  }
]

const PARAGENS = [
  {
    nome: 'Martim Moniz',
    sentido: 'Saída para Campo de Ourique',
    proximo: 'Partida em 2 min',
    estado: 'No horário',
    ocorrencia: null
  },
  {
    nome: 'Graça',
    sentido: 'Sentido Campo de Ourique',
    proximo: 'Chegada em 5 min',
    estado: 'Atraso de 3 min',
    ocorrencia: 'Condicionamento na R. Voz Operário'
  },
  {
    nome: 'Sé',
    sentido: 'Sentido Campo de Ourique',
    proximo: 'Chegada em 9 min',
    estado: 'No horário',
    ocorrencia: null
  },
  {
    nome: 'Chiado',
    sentido: 'Sentido Campo de Ourique',
    proximo: 'Chegada em 13 min',
    estado: 'No horário',
    ocorrencia: null
  },
  {
    nome: 'Estrela',
    sentido: 'Sentido Campo de Ourique',
    proximo: 'Chegada em 16 min',
    estado: 'Atraso de 4 min',
    ocorrencia: 'Atraso da chapa 28E/03'
  },
  {
    nome: 'Prazeres',
    sentido: 'Terminal Campo de Ourique',
    proximo: 'Chegada em 20 min',
    estado: 'No horário',
    ocorrencia: null
  }
]

const PROXIMAS_PARTIDAS = [
  { chapa: '28E/01', partida: '14:35', destino: 'Campo de Ourique', via: 'Graça', estado: 'A decorrer' },
  { chapa: '28E/05', partida: '14:43', destino: 'Martim Moniz', via: 'Chiado', estado: 'Preparar embarque' },
  { chapa: '28E/03', partida: '14:52', destino: 'Campo de Ourique', via: 'Sé', estado: 'Atrasado 4 min' }
]

const AVISOS = [
  {
    titulo: 'Condicionamento Graça',
    descricao: 'Equipe de fiscalização no local. Atrasos médios de 3 a 4 minutos.',
    prioridade: 'alta'
  },
  {
    titulo: 'Reposição Martim Moniz',
    descricao: 'Reposição concluída. Retomar procedimento habitual de partida.',
    prioridade: 'media'
  }
]

const OBSERVACOES_INICIAIS = [
  {
    autor: 'Posto Central',
    hora: '14:32',
    mensagem: 'Trânsito condicionado entre Graça e Voz Operário. Circular com atenção.',
    tipo: 'alerta'
  },
  {
    autor: 'Tripulante 180939',
    hora: '14:28',
    mensagem: 'Chapa 28E/03 a chegar a Estrela. Passageiros estão a ser avisados do atraso.',
    tipo: 'info'
  },
  {
    autor: 'Posto de Manobra',
    hora: '14:10',
    mensagem: 'Reposição concluída na Martim Moniz. Linha livre para partida.',
    tipo: 'operacao'
  }
]

export default function CarreiraPage() {
  const navigate = useNavigate()
  const [observacoes, setObservacoes] = useState(OBSERVACOES_INICIAIS)
  const [novaObservacao, setNovaObservacao] = useState('')
  const [tipoNovaObservacao, setTipoNovaObservacao] = useState('info')

  const handleAdicionarObservacao = () => {
    if (!novaObservacao.trim()) return

    const agora = new Date()
    const hora = HORA_FORMATTER.format(agora)

    setObservacoes(prev => [
      ...prev,
      {
        autor: 'Você',
        hora,
        mensagem: novaObservacao,
        tipo: tipoNovaObservacao
      }
    ])
    setNovaObservacao('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Carreira 28E</h1>
            <p className="text-sm text-gray-500">Campo de Ourique ↔ Martim Moniz</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/chat-carreira')}
          className="hidden sm:flex items-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat AI</span>
        </Button>
      </header>

      <main className="flex-1 p-4">
        <Tabs defaultValue="overview" className="w-full max-w-5xl mx-auto">
          <TabsList className="w-full gap-2 bg-white p-1 border border-gray-200 rounded-lg">
            <TabsTrigger
              value="overview"
              className="w-full text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="percurso"
              className="w-full text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Percurso
            </TabsTrigger>
            <TabsTrigger
              value="observacoes"
              className="w-full text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Observações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {METRICAS.map(metrica => {
                const Icon = metrica.icon
                return (
                  <div key={metrica.titulo} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{metrica.titulo}</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">{metrica.valor}</p>
                      </div>
                      <span className={`p-2 rounded-full ${metrica.iconBg}`}>
                        <Icon className="w-5 h-5" />
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">{metrica.detalhe}</p>
                  </div>
                )
              })}
            </section>

            <Separator />

            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Próximas partidas</h2>
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> Atualizado agora mesmo
                </span>
              </div>
              <div className="space-y-3">
                {PROXIMAS_PARTIDAS.map(partida => (
                  <div
                    key={partida.chapa}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 rounded-md p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-700 rounded-md px-2 py-1 text-xs font-semibold">
                        {partida.chapa}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{partida.destino}</p>
                        <p className="text-xs text-gray-500">Via {partida.via}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center space-x-3 text-sm">
                      <span className="font-semibold text-gray-800">{partida.partida}</span>
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          partida.estado.includes('Atrasado')
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {partida.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVISOS.map(aviso => (
                <div key={aviso.titulo} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center mb-3">
                    <AlertCircle
                      className={`w-5 h-5 mr-2 ${
                        aviso.prioridade === 'alta'
                          ? 'text-red-600'
                          : aviso.prioridade === 'media'
                            ? 'text-amber-600'
                            : 'text-gray-500'
                      }`}
                    />
                    <h3 className="text-sm font-semibold text-gray-900">{aviso.titulo}</h3>
                  </div>
                  <p className="text-sm text-gray-700">{aviso.descricao}</p>
                </div>
              ))}
            </section>
          </TabsContent>

          <TabsContent value="percurso" className="mt-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Percurso em tempo real
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300" aria-hidden="true"></div>
                <div className="space-y-6">
                  {PARAGENS.map((paragem, index) => (
                    <div key={paragem.nome} className="pl-10 relative">
                      <div
                        className={`absolute left-4 top-1.5 w-3 h-3 rounded-full border-2 ${
                          paragem.ocorrencia ? 'border-red-500 bg-red-100' : 'border-blue-500 bg-blue-100'
                        }`}
                      ></div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-gray-900">{paragem.nome}</p>
                          <p className="text-xs text-gray-500">{paragem.sentido}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 flex items-center space-x-3 text-sm">
                          <span className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            {paragem.proximo}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              paragem.ocorrencia
                                ? 'bg-red-100 text-red-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {paragem.estado}
                          </span>
                        </div>
                      </div>
                      {paragem.ocorrencia && (
                        <p className="mt-2 text-xs text-red-600">{paragem.ocorrencia}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="observacoes" className="mt-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Observações partilhadas</h2>
                <p className="text-sm text-gray-500">Informação colaborativa em tempo real</p>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {observacoes.map((obs, index) => (
                  <div key={`${obs.autor}-${index}`} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-800">{obs.mensagem}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {obs.hora} · {obs.autor}
                        </p>
                      </div>
                      <span
                          className={`ml-2 px-2 py-1 rounded-md text-[11px] font-medium ${
                          TIPO_OBSERVACAO_CLASSES[obs.tipo] ?? TIPO_OBSERVACAO_CLASSES.nota
                        }`}
                      >
                        {obs.tipo.charAt(0).toUpperCase() + obs.tipo.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-800">Adicionar observação</h3>
                <div className="grid gap-3">
                  <textarea
                    value={novaObservacao}
                    onChange={event => setNovaObservacao(event.target.value)}
                    rows={3}
                    placeholder="Registe informação útil para a equipa..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <select
                      value={tipoNovaObservacao}
                      onChange={event => setTipoNovaObservacao(event.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="info">Informação</option>
                      <option value="alerta">Alerta</option>
                      <option value="operacao">Operação</option>
                      <option value="nota">Nota</option>
                    </select>
                    <Button onClick={handleAdicionarObservacao} className="sm:w-auto">
                      Registar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-600 flex items-center">
            <TramFront className="w-4 h-4 mr-2 text-yellow-600" />
            Dados simulados para a carreira 28E.
          </div>
          <Button onClick={() => navigate('/chat-carreira')} className="flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" /> Abrir chat com IA
          </Button>
        </div>
      </div>
    </div>
  )
}