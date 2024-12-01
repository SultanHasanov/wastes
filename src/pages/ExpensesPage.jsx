import React, { useState, useEffect } from "react";
import { ExpenseTable } from "../components/ExpenseTable";
import { ExpenseForm } from "../components/ExpenseForm";
import { Filter } from "../components/Filter";
import { Chart } from "../components/Chart";
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from "../services/api";
import { Button } from "antd";

export const ExpensesPage = ({ onLogout }) => {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showCalendar, setShowCalendar] = useState(false); // Состояние для управления показом календаря

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const data = await fetchExpenses();
        setExpenses(data); // Загружаем все расходы
      } catch (error) {
        console.error("Ошибка загрузки расходов:", error);
      }
    };
    loadExpenses();
  }, []);

  const handleAddExpense = async (newExpense) => {
    const addedExpense = await addExpense(newExpense);
    setExpenses([...expenses, addedExpense]);
  };

  const handleUpdateExpense = async (id, updatedExpense) => {
    const expense = await updateExpense(id, updatedExpense);
    setExpenses(expenses.map((exp) => (exp.id === id ? expense : exp)));
  };

  const handleDeleteExpense = async (id) => {
    await deleteExpense(id);
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  return (
    <div>
      <Button onClick={onLogout}>Выход</Button>
      <h1 style={{ margin: "0px", marginBottom: "20px" }}>Расходы</h1>
      {/* Передаем состояние showCalendar в фильтр */}
      <Filter setFilter={setFilter} setShowCalendar={setShowCalendar}/>
      <ExpenseForm showCalendar={showCalendar} onAddExpense={handleAddExpense} />
      <Chart expenses={expenses} />
      <ExpenseTable
        expenses={expenses}
        filter={filter} // Передаем фильтр в компонент таблицы
        onUpdateExpense={handleUpdateExpense}
        onDeleteExpense={handleDeleteExpense}
       
      />
    </div>
  );
};
