import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function GestaoHorariosPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [ficheiros, setFicheiros] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const isTripulantePlus = user && user.tipo === "Tripulante+";
  const apiUrl = import.meta.env.VITE_API_URL;

  // 🔹 Carregar ficheiros do dia selecionado
  const carregarFicheiros = async () => {
    const dataStr = dataSelecionada.toISOString().split("T")[0];
    try {
      const res = await fetch(`${apiUrl}/horarios/${dataStr}`);
      const dados = await res.json();
      setFicheiros(dados);
    } catch {
      setFicheiros([]);
    }
  };

  useEffect(() => {
    carregarFicheiros();
  }, [dataSelecionada]);

  // 🔹 Upload
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMensagem("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMensagem("Por favor, selecione um ficheiro para carregar.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await fetch(`${apiUrl}/horarios/upload`, {
        method: "POST",
        body: formData,
      });
      setMensagem("✅ Ficheiro carregado com sucesso!");
      setSelectedFile(null);
      carregarFicheiros();
    } catch {
      setMensagem("❌ Erro ao carregar ficheiro.");
    }
  };

  // 🔹 Apagar
  const handleDelete = async (ficheiro) => {
    try {
      await fetch(`${apiUrl}/horarios/${ficheiro}`, { method: "DELETE" });
      carregarFicheiros();
    } catch {
      alert("Erro ao apagar ficheiro.");
    }
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
        <h1 className="text-xl font-bold text-gray-900">Gestão de Horários</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Calendário */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            📅 Selecionar Dia
          </h2>
          <div className="flex justify-center">
            <Calendar onChange={setDataSelecionada} value={dataSelecionada} />
          </div>
        </div>

        {/* Lista de ficheiros */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            Horários em {dataSelecionada.toLocaleDateString("pt-PT")}
          </h2>
          {ficheiros.length > 0 ? (
            <div className="space-y-2">
              {ficheiros.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg"
                >
                  <a
                    href={`${apiUrl}${f.ficheiro}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 font-medium"
                  >
                    📘 Carreira {f.carreira} – {f.chapa}
                  </a>
                  {isTripulantePlus && (
                    <button
                      onClick={() => handleDelete(f.ficheiro.split("/").pop())}
                      className="text-red-600 ml-2"
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              Nenhum horário disponível neste dia.
            </p>
          )}
        </div>

        {/* Upload (Tripulante+) */}
        {isTripulantePlus && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              ⬆️ Upload de Novos Horários
            </h2>
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-3"
              accept=".pdf,.txt"
            />
            <button
              onClick={handleUpload}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
            >
              Carregar
            </button>
            {mensagem && (
              <p className="mt-3 text-sm text-center text-gray-700">
                {mensagem}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default GestaoHorariosPage;
