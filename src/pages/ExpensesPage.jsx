import React, { useState, useEffect, useMemo } from "react";
import { ExpenseTable } from "../components/ExpenseTable";
import { ExpenseForm } from "../components/ExpenseForm";
import { Filter } from "../components/Filter";
// import { Chart } from "../components/Chart";
import {
  fetchExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../services/api";
import { Button, Space, Typography } from "antd";

const { Text } = Typography;

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

  const filteredExpenses = useMemo(() => {
    if (!filter.startDate) {
      return expenses;
    }

    const startDate = new Date(filter.startDate);
    const endDate = filter.endDate ? new Date(filter.endDate) : startDate;

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      // Проверяем, попадает ли дата расхода в выбранный диапазон
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  }, [expenses, filter]);

  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [filteredExpenses]);

  const total = useMemo(() => {
    return sortedExpenses.reduce((acc, el) => acc + Number(el.amount), 0);
  }, [sortedExpenses]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <Space align="center">
        <h1 style={{ margin: "0px", marginBottom: "20px" }}>Расходы</h1>
        <Text style={{ fontSize: "20px" }} keyboard>
          Общая сумма: <b style={{ color: "green" }}>{formatAmount(total)}</b>
        </Text>
        <Button onClick={onLogout}>Выход</Button>
        {/* Передаем состояние showCalendar в фильтр */}
      </Space>
      <Filter setFilter={setFilter} setShowCalendar={setShowCalendar} />
      <ExpenseForm
        showCalendar={showCalendar}
        onAddExpense={handleAddExpense}
      />
      {/* <Chart expenses={expenses} /> */}
      <ExpenseTable
        expenses={expenses}
        filter={filter} // Передаем фильтр в компонент таблицы
        onUpdateExpense={handleUpdateExpense}
        onDeleteExpense={handleDeleteExpense}
      />
    </div>
  );
};
