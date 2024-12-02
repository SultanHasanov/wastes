import React, { useState, useMemo } from "react";
import { Table, Modal } from "antd";
import { ExpenseForm } from "./ExpenseForm";
import { DeleteOutlined, EditTwoTone, SettingOutlined } from "@ant-design/icons";
import '../App.css';

export const ExpenseTable = React.memo(({ expenses, filter, onUpdateExpense, onDeleteExpense }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // const { Text } = Typography;

  // Фильтрация расходов по выбранной дате или диапазону дат
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

  // Сортировка расходов по дате
  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filteredExpenses]);

  // Подсчет общей суммы расходов
  // const total = useMemo(() => {
  //   return sortedExpenses.reduce((acc, el) => acc + Number(el.amount), 0);
  // }, [sortedExpenses]);

  const showEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalVisible(true);
  };

  const handleUpdate = (updatedExpense) => {
    onUpdateExpense(editingExpense.id, updatedExpense);
    setIsModalVisible(false);
    setEditingExpense(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingExpense(null);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (isoString) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(isoString));
  };

  const columns = [
    { title: "Траты", dataIndex: "comment", key: "comment" },
    {
      title: "Сумма",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => formatAmount(amount),
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      render: (date) => formatDate(date),
    },
    {
      title: <SettingOutlined style={{ fontSize: '18px' }} />,
      key: "actions",
      render: (_, record) => (
        <div className="icons">
          <EditTwoTone style={{ fontSize: '20px' }} onClick={() => showEditModal(record)} />
          <DeleteOutlined
            onClick={() => handleDeleteExpense(record.id)}
            style={{ color: "red", fontSize: '20px', marginLeft: "15px" }}
          />
        </div>
      ),
    },
  ];

  const handleDeleteExpense = (id) => {
    Modal.confirm({
      title: 'Вы уверены, что хотите удалить этот расход?',
      content: 'Это действие необратимо!',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: () => onDeleteExpense(id),
    });
  };

  const paginationConfig = {
    pageSize: 10, // Количество элементов на странице
    total: sortedExpenses.length, // Общее количество элементов
    showSizeChanger: true, // Показывает опцию выбора количества элементов на странице
    pageSizeOptions: ['5', '10', '20'], // Опции для выбора размера страницы
  };

  return (
    <>
    
      <Table pagination={paginationConfig} responsive dataSource={sortedExpenses} columns={columns} rowKey="id" />
      <Modal
        title="Редактировать расход"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <ExpenseForm
          onAddExpense={handleUpdate}
          initialValues={editingExpense}
        />
      </Modal>
    </>
  );
});
