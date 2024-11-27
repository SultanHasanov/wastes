import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Chart = ({ expenses }) => {
  // Форматирование дат с учетом локали
  const formatDate = (date) =>
    new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  // Группировка расходов по дате
  const groupedByDate = expenses.reduce((acc, expense) => {
    const formattedDate = formatDate(expense.date); // Форматируем дату
    acc[formattedDate] = (acc[formattedDate] || 0) + Number(expense.amount);

    return acc;
  }, {});

  // Данные для диаграммы
  const data = {
    labels: Object.keys(groupedByDate),
    datasets: [
      {
        label: "Расходы", // Название набора данных
        data: Object.values(groupedByDate),
        backgroundColor: "rgba(75,192,192,1.4)", // Цвет столбцов
      },
    ],
  };

 // Опции для диаграммы
 const options = {
    responsive: true,  // диаграмма будет адаптироваться к изменениям размера контейнера
    maintainAspectRatio: false, // отключает сохранение соотношения сторон
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};