import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { carris12EConfig } from '../config/carris';

// Ícone dos elétricos
const tramIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png",
  iconSize: [30, 30],
});

const Carreira12EPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

// Paragens fixas com coordenadas aproximadas do percurso real
  const paragensDetalhes = useMemo(
    () => [
      { nome: 'Martim Moniz', lat: 38.7147, lng: -9.1362 },
      { nome: 'Socorro', lat: 38.7143, lng: -9.1347 },
      { nome: 'Lg. Terreirinho', lat: 38.714, lng: -9.1333 },
      { nome: 'R. Lagares', lat: 38.714, lng: -9.1322 },
      { nome: 'S. Tomé', lat: 38.7136, lng: -9.1314 },
      { nome: 'Lg. Portas Sol', lat: 38.7129, lng: -9.131 },
      { nome: 'Sta. Luzia', lat: 38.7119, lng: -9.1306 },
      { nome: 'Limoeiro', lat: 38.7114, lng: -9.131 },
      { nome: 'Sé', lat: 38.7109, lng: -9.1331 },
      { nome: 'R. Conceição', lat: 38.7099, lng: -9.1361 },
      { nome: 'Lg. Academia Nac. Belas Artes', lat: 38.7097, lng: -9.1388 },
      { nome: 'R. Serpa Pinto', lat: 38.7095, lng: -9.1399 },
      { nome: 'Chiado', lat: 38.7094, lng: -9.1415 },
      { nome: 'Pç. Luís Camões', lat: 38.709, lng: -9.143 }
    ],
    []
  );

  const paragens = useMemo(() => paragensDetalhes.map(({ nome }) => nome), [paragensDetalhes]);

  // Estado real de veículos
  const [veiculos, setVeiculos] = useState([]);
  const [fonteDados, setFonteDados] = useState('simulado');
  const [erroCarris, setErroCarris] = useState(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);

  // Observações
  const [observacoes, setObservacoes] = useState([]);
  const [novaObservacao, setNovaObservacao] = useState('');

  const obterIndiceParagemMaisProxima = useCallback(
    (lat, lng) => {
      if (typeof lat !== 'number' || Number.isNaN(lat) || typeof lng !== 'number' || Number.isNaN(lng)) {
        return null;
      }

      const toRad = (valor) => (valor * Math.PI) / 180;

      const calcularDistancia = (lat1, lng1, lat2, lng2) => {
        const R = 6371000;
        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      let indiceMaisProximo = null;
      let menorDistancia = Number.POSITIVE_INFINITY;

      paragensDetalhes.forEach(({ lat: latParagem, lng: lngParagem }, index) => {
        const distancia = calcularDistancia(lat, lng, latParagem, lngParagem);
        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          indiceMaisProximo = index;
        }
      });

      return indiceMaisProximo;
    },
    [paragensDetalhes]
  );

  const normalizarPosicao = useCallback(
    (posicao) => {
      if (typeof posicao !== 'number' || Number.isNaN(posicao)) {
        return null;
      }

      const posicaoInteira = Math.round(posicao);
      return Math.min(Math.max(posicaoInteira, 0), paragensDetalhes.length - 1);
    },
    [paragensDetalhes.length]
  );

  const formatarVeiculos = useCallback(
    (listaVeiculos) => {
      if (!Array.isArray(listaVeiculos)) {
        return [];
      }

      return listaVeiculos
        .map((veiculoOriginal) => {
          const chapa =
            veiculoOriginal?.chapa ||
            veiculoOriginal?.prefixo ||
            veiculoOriginal?.vehicleNumber ||
            veiculoOriginal?.vehicle ||
            veiculoOriginal?.id ||
            veiculoOriginal?.identifier;

          const sentido =
            veiculoOriginal?.sentido ||
            veiculoOriginal?.direction ||
            veiculoOriginal?.destino ||
            veiculoOriginal?.headsign ||
            veiculoOriginal?.destination;

          const confirmado =
            typeof veiculoOriginal?.confirmado === 'boolean'
              ? veiculoOriginal.confirmado
              : typeof veiculoOriginal?.confirmed === 'boolean'
              ? veiculoOriginal.confirmed
              : true;

          const latitude =
            typeof veiculoOriginal?.lat === 'number'
              ? veiculoOriginal.lat
              : typeof veiculoOriginal?.latitude === 'number'
              ? veiculoOriginal.latitude
              : typeof veiculoOriginal?.position?.lat === 'number'
              ? veiculoOriginal.position.lat
              : typeof veiculoOriginal?.position?.latitude === 'number'
              ? veiculoOriginal.position.latitude
              : undefined;

          const longitude =
            typeof veiculoOriginal?.lng === 'number'
              ? veiculoOriginal.lng
              : typeof veiculoOriginal?.lon === 'number'
              ? veiculoOriginal.lon
              : typeof veiculoOriginal?.longitude === 'number'
              ? veiculoOriginal.longitude
              : typeof veiculoOriginal?.position?.lng === 'number'
              ? veiculoOriginal.position.lng
              : typeof veiculoOriginal?.position?.lon === 'number'
              ? veiculoOriginal.position.lon
              : typeof veiculoOriginal?.position?.longitude === 'number'
              ? veiculoOriginal.position.longitude
              : undefined;

          const posicoesConhecidas = [
            veiculoOriginal?.posicao,
            veiculoOriginal?.position,
            veiculoOriginal?.stopIndex,
            veiculoOriginal?.stopSequence,
            veiculoOriginal?.proximaParagemIndex,
          ].filter((valor) => typeof valor === 'number' && !Number.isNaN(valor));

          let indiceParagem = null;

          if (posicoesConhecidas.length > 0) {
            indiceParagem = normalizarPosicao(posicoesConhecidas[0]);
          }

          const nomesParagem = [
            veiculoOriginal?.paragem,
            veiculoOriginal?.stopName,
            veiculoOriginal?.nextStop,
            veiculoOriginal?.destino,
          ].filter((valor) => typeof valor === 'string' && valor.trim().length > 0);

          if (indiceParagem === null && nomesParagem.length > 0) {
            const nomeNormalizado = nomesParagem[0].toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
            const candidato = paragensDetalhes.findIndex(({ nome }) =>
              nome
                .toLowerCase()
                .normalize('NFD')
                .replace(/\p{Diacritic}/gu, '')
                .includes(nomeNormalizado)
            );

            if (candidato >= 0) {
              indiceParagem = candidato;
            }
          }

          let lat = typeof latitude === 'number' ? latitude : undefined;
          let lng = typeof longitude === 'number' ? longitude : undefined;

          if (indiceParagem === null && typeof lat === 'number' && typeof lng === 'number') {
            indiceParagem = obterIndiceParagemMaisProxima(lat, lng);
          }

          if (indiceParagem !== null && (typeof lat !== 'number' || typeof lng !== 'number')) {
            const paragem = paragensDetalhes[indiceParagem];
            lat = paragem?.lat;
            lng = paragem?.lng;
          }

          if (indiceParagem === null) {
            return null;
          }

          return {
            chapa: chapa || '—',
            sentido: sentido || 'Desconhecido',
            confirmado,
            posicao: indiceParagem,
            lat,
            lng,
          };
        })
        .filter(Boolean);
    },
    [normalizarPosicao, obterIndiceParagemMaisProxima, paragensDetalhes]
  );

  const gerarSimulacao = useCallback(() => {
    const selecoes = [2, 6, 10];

    return selecoes.map((indice, idx) => {
      const paragem = paragensDetalhes[indice];
      return {
        chapa: ['14', '7', '1'][idx] || `SIM-${idx + 1}`,
        sentido: idx === 0 ? 'Camoes' : 'Moniz',
        posicao: indice,
        confirmado: idx !== 1,
        lat: paragem?.lat,
        lng: paragem?.lng,
      };
    });
  }, [paragensDetalhes]);

  const extrairListaVeiculos = useCallback(
    (payload) => {
      if (Array.isArray(payload)) {
        return payload;
      }

      if (payload && typeof payload === 'object') {
        if (Array.isArray(payload.vehicles)) {
          return payload.vehicles;
        }

        if (Array.isArray(payload.data)) {
          return payload.data;
        }

        if (Array.isArray(payload.result)) {
          return payload.result;
        }
      }

      return [];
    },
    []
  );

  const atualizarVeiculos = useCallback(async () => {
    let carregadoDeCarris = false;

    if (carris12EConfig.enabled && carris12EConfig.realtimeUrl) {
      try {
        const resposta = await fetch(carris12EConfig.realtimeUrl, {
          headers: carris12EConfig.headers,
        });

        if (!resposta.ok) {
          throw new Error(`Carris respondeu com código ${resposta.status}`);
        }

        const payload = await resposta.json();
        const listaVeiculos = extrairListaVeiculos(payload);
        const veiculosFormatados = formatarVeiculos(listaVeiculos);

        setVeiculos(veiculosFormatados);
        setFonteDados('carris');
        setErroCarris(null);
        setUltimaAtualizacao(new Date());
        carregadoDeCarris = true;
      } catch (error) {
        console.error('Erro ao carregar dados da Carris:', error);
        setErroCarris(error.message || 'Não foi possível ligar à API da Carris.');
      }
    }

    if (!carregadoDeCarris) {
      setVeiculos(formatarVeiculos(gerarSimulacao()));
      setFonteDados('simulado');
    }
  }, [extrairListaVeiculos, formatarVeiculos, gerarSimulacao]);

  useEffect(() => {
    atualizarVeiculos();
    const interval = setInterval(atualizarVeiculos, 15000);
    return () => clearInterval(interval);
  }, [atualizarVeiculos]);

  // Adicionar observações
  const handleAdicionarObservacao = () => {
    if (novaObservacao.trim()) {
      const agora = new Date();
      const hora = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')} ${agora.getDate().toString().padStart(2, '0')}/${(agora.getMonth() + 1).toString().padStart(2, '0')}`;
      const novaObs = { autor: user?.numero || 'Anónimo', msg: novaObservacao, hora };
      setObservacoes([...observacoes, novaObs]);
      setNovaObservacao('');
    }
  };

  // Veículos por paragem
  const getVeiculosNaParagem = (index) =>
    veiculos.filter((veiculo) => normalizarPosicao(veiculo.posicao) === index);

  const mapCenter = useMemo(() => {
    const mediaLat =
      paragensDetalhes.reduce((acc, { lat }) => acc + lat, 0) / paragensDetalhes.length;
    const mediaLng =
      paragensDetalhes.reduce((acc, { lng }) => acc + lng, 0) / paragensDetalhes.length;

    return [mediaLat, mediaLng];
  }, [paragensDetalhes]);

  const renderVeiculosCirculos = (veiculosNaParagem) => (
    <div className="flex space-x-1 ml-4">
      {veiculosNaParagem.map((veiculo, index) => (
        <div
          key={`${veiculo.chapa}-${index}`}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            veiculo.confirmado
              ? veiculo.sentido === 'Camoes'
                ? 'bg-blue-500 text-white'
                : 'bg-red-500 text-white'
              : veiculo.sentido === 'Camoes'
                ? 'border-2 border-blue-500 bg-transparent text-blue-500'
                : 'border-2 border-red-500 bg-transparent text-red-500'
          }`}
        >
          {veiculo.confirmado ? veiculo.chapa : ''}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button onClick={() => navigate('/dashboard')} className="mr-4 p-2 text-blue-600">←</button>
        <h1 className="text-xl font-bold text-gray-900">Carreira 12E</h1>
      </header>

      <main className="p-4 space-y-6">
        <div className="bg-blue-50 border border-blue-100 text-blue-800 text-sm rounded-lg px-4 py-3 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium">Estado da ligação à Carris</p>
              <p className="mt-1">
                Fonte atual: {fonteDados === 'carris' ? 'Carris (tempo real)' : 'Simulação interna'}.{' '}
                {fonteDados === 'carris'
                  ? 'Os elétricos apresentados provêm diretamente da API oficial.'
                  : 'Estamos a manter a grelha ativa enquanto a ligação oficial não responde.'}
              </p>
            </div>
            <span
              className={`mt-0.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                fonteDados === 'carris' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {fonteDados === 'carris' ? 'Ligado' : 'Em modo de contingência'}
            </span>
          </div>
          {ultimaAtualizacao && (
            <p className="text-xs text-blue-700">
              Última atualização: {ultimaAtualizacao.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          )}
          {erroCarris && (
            <p className="text-xs text-red-600">
              Aviso Carris: {erroCarris}
            </p>
          )}
        </div>

        {/* Mapa Interativo */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Mapa Interativo</h2>
          <MapContainer center={mapCenter} zoom={14} style={{ height: '300px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {veiculos.map((veiculo, idx) => {
              const posicaoNormalizada = normalizarPosicao(veiculo.posicao);
              const paragemAtual =
                typeof posicaoNormalizada === 'number'
                  ? paragensDetalhes[posicaoNormalizada]
                  : undefined;

              const lat = typeof veiculo.lat === 'number' ? veiculo.lat : paragemAtual?.lat;
              const lng = typeof veiculo.lng === 'number' ? veiculo.lng : paragemAtual?.lng;

              if (typeof lat !== 'number' || typeof lng !== 'number') {
                return null;
              }

              return (
                <Marker key={`${veiculo.chapa}-${idx}`} position={[lat, lng]} icon={tramIcon}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">Elétrico {veiculo.chapa}</p>
                      <p className="text-xs text-gray-600">Sentido {veiculo.sentido}</p>
                      {paragemAtual && (
                        <p className="text-xs text-gray-500 mt-1">
                          Paragem atual: {paragemAtual.nome}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
          <p className="mt-3 text-xs text-gray-500">
            ℹ️ Localização baseada nas paragens reais do percurso. Os marcadores surgem nas mesmas
            posições mostradas na lista seguinte.
          </p>
        </div>

        {/* Lista de Paragens */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Percurso</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            <div className="space-y-4">
              {paragens.map((paragem, index) => {
                const veiculosNaParagem = getVeiculosNaParagem(index);
                const isTerminal = index === 0 || index === paragens.length - 1;
                return (
                  <div key={index} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full z-10 ${isTerminal ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
                    <div className="ml-4 flex-1">
                      <span className={`text-sm font-medium ${isTerminal ? 'text-purple-600' : 'text-gray-700'}`}>
                        {paragem}
                      </span>
                    </div>
                    {renderVeiculosCirculos(veiculosNaParagem)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Observações Partilhadas</h2>
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {observacoes.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma observação registada.</p>
            ) : (
              observacoes.map((obs, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-800">{obs.msg}</p>
                  <p className="text-xs text-gray-500 mt-1">{obs.hora} | {obs.autor}</p>
                </div>
              ))
            )}
          </div>
          <div className="border-t pt-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={novaObservacao}
                onChange={(e) => setNovaObservacao(e.target.value)}
                placeholder="Adicionar observação…"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAdicionarObservacao()}
              />
              <button onClick={handleAdicionarObservacao} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">➕</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Carreira12EPage;