import React, { useState, useEffect } from "react";
import { ExpenseTable } from "../components/ExpenseTable";
import { ExpenseForm } from "../components/ExpenseForm";
import { Filter } from "../components/Filter";
import { Chart } from "../components/Chart";
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from "../services/api";
import { Button } from "antd";

export const ExpensesPage = ({ onLogout }) => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const data = await fetchExpenses();
        setExpenses(data);
      } catch (error) {
        console.error("Ошибка загрузки расходов:", error);
      }
    };
    loadExpenses();
  }, []);

  useEffect(() => {
    const now = new Date();
    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      if (filter === "today") return expenseDate.toDateString() === now.toDateString();
      if (filter === "week") return now - expenseDate <= 7 * 24 * 60 * 60 * 1000;
      if (filter === "month") return now.getMonth() === expenseDate.getMonth();
      return true;
    });
    setFilteredExpenses(filtered);
  }, [filter, expenses]);

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
      <Filter setFilter={setFilter} />
      <ExpenseForm onAddExpense={handleAddExpense} />
      <Chart expenses={filteredExpenses} />
      <ExpenseTable
        expenses={filteredExpenses}
        onUpdateExpense={handleUpdateExpense}
        onDeleteExpense={handleDeleteExpense}
      />
    </div>
  );
};
