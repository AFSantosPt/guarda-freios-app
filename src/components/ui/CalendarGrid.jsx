import { useState } from "react";

export default function CalendarGrid({ onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [...Array(daysInMonth).keys()].map(d => d + 1);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="bg-white shadow rounded-lg p-4">
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
