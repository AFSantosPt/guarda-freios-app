import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import Calendar from "react-calendar"

export default function ConsultarServicoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [servico, setServico] = useState({ partes: [] });
  const [novasPartes, setNovasPartes] = useState([
    { numero: "", inicio: "", fim: "", viatura: "", afetacao: "" }
  ]);
  const [chapas, setChapas] = useState([]);
  const [servicosUpload, setServicosUpload] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const dataStr = dataSelecionada.toISOString().split("T")[0];
    fetch(`${apiUrl}/servicos/${dataStr}`)
      .then((res) => res.json())
      .then((dados) => setServico(dados))
      .catch(() => setServico({ partes: [] }));
  }, [dataSelecionada]);

  const handleChange = (i, field, value) => {
    const copia = [...novasPartes];
    copia[i][field] = value;
    setNovasPartes(copia);
  };

  const addParte = () =>
    setNovasPartes([
      ...novasPartes,
      { numero: "", inicio: "", fim: "", viatura: "", afetacao: "" },
    ]);

  const removeParte = (i) =>
    setNovasPartes(novasPartes.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataStr = dataSelecionada.toISOString().split("T")[0];
    await fetch(`${apiUrl}/servicos/${dataStr}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partes: novasPartes }),
    });
    alert("Serviço registado!");
    setNovasPartes([
      { numero: "", inicio: "", fim: "", viatura: "", afetacao: "" },
    ]);
    // refresh lista
    const dados = await fetch(`${apiUrl}/servicos/${dataStr}`).then(r=>r.json());
    setServico(dados);
  };

  const handleUpload = async (e, tipo) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${apiUrl}/upload/${tipo}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (tipo === "chapa") setChapas((prev) => [...prev, data]);
    else setServicosUpload((prev) => [...prev, data]);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="mr-4 p-2 text-blue-600"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900">Serviços</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Calendário */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            📅 Calendário
          </h2>
          <div className="flex justify-center">
            <Calendar onChange={setDataSelecionada} value={dataSelecionada} />
          </div>
        </div>

        {/* Lista de Serviços */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            Serviços em {dataSelecionada.toLocaleDateString("pt-PT")}
          </h2>
          {servico?.partes && servico.partes.length > 0 ? (
            servico.partes.map((parte, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-bold text-blue-600 text-center">
                  Parte {i + 1} – Serviço {parte.numero}
                </h3>
                <p className="text-center text-gray-700 mt-2">
                  ⏰ {parte.inicio} → {parte.fim}
                </p>
                <p className="text-center text-gray-600">🚋 {parte.viatura}</p>
                <p className="text-center text-gray-600">🔧 {parte.afetacao}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              Nenhum serviço registado neste dia.
            </p>
          )}
        </div>

        {/* Adicionar Serviços */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            ➕ Adicionar Serviços
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {novasPartes.map((parte, i) => (
              <div key={i} className="bg-gray-50 border p-3 rounded-lg space-y-2 shadow-sm">
                <input
                  type="text"
                  placeholder="Nº Serviço"
                  value={parte.numero}
                  onChange={(e) => handleChange(i, "numero", e.target.value)}
                  className="border w-full p-2 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Início (HH:mm)"
                  value={parte.inicio}
                  onChange={(e) => handleChange(i, "inicio", e.target.value)}
                  className="border w-full p-2 rounded-lg"
                  required
                  pattern="^([01]\d|2[0-9]):[0-5]\d$"
                />
                <input
                  type="text"
                  placeholder="Fim (HH:mm)"
                  value={parte.fim}
                  onChange={(e) => handleChange(i, "fim", e.target.value)}
                  className="border w-full p-2 rounded-lg"
                  required
                  pattern="^([01]\d|2[0-9]):[0-5]\d$"
                />
                <input
                  type="text"
                  placeholder="Viatura"
                  value={parte.viatura}
                  onChange={(e) => handleChange(i, "viatura", e.target.value)}
                  className="border w-full p-2 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Afetação"
                  value={parte.afetacao}
                  onChange={(e) => handleChange(i, "afetacao", e.target.value)}
                  className="border w-full p-2 rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => removeParte(i)}
                  className="text-red-600"
                >
                  ❌ Remover
                </button>
              </div>
            ))}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={addParte}
                className="bg-gray-200 px-3 py-2 rounded-lg"
              >
                ➕ Nova Parte
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>

        {/* Gestão Avançada */}
        {user?.tipo === "Tripulante+" && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              ⚙️ Gestão Avançada
            </h2>

            {/* Chapas */}
            <div className="mb-6">
              <h3 className="text-md font-bold text-blue-700 mb-2">📘 Chapas</h3>
              <input
                type="file"
                accept=".txt"
                onChange={(e) => handleUpload(e, "chapa")}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {chapas.map((c, i) => (
                  <div
                    key={i}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg flex items-center"
                  >
                    <a
                      href={`${apiUrl}${c.pdfFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {c.nome}
                    </a>
                    <button
                      onClick={() =>
                        setChapas((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="ml-2 text-red-600"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Serviços */}
            <div>
              <h3 className="text-md font-bold text-green-700 mb-2">
                📗 Serviços
              </h3>
              <input
                type="file"
                accept=".txt"
                onChange={(e) => handleUpload(e, "servico")}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {servicosUpload.map((s, i) => (
                  <div
                    key={i}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-lg flex items-center"
                  >
                    <a
                      href={`${apiUrl}${s.pdfFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.nome}
                    </a>
                    <button
                      onClick={() =>
                        setServicosUpload((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
                      }
                      className="ml-2 text-red-600"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
