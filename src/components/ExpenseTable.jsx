import React, {useState, useMemo } from "react";
import { Table, Modal, Typography } from "antd";
import { ExpenseForm } from "./ExpenseForm";
import { DeleteOutlined, EditTwoTone } from "@ant-design/icons";
import '../App.css';

export const ExpenseTable = React.memo(({expenses, onUpdateExpense, onDeleteExpense }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const { Text } = Typography;

  const total = useMemo(() => {
    return expenses.reduce((acc, el) => acc + Number(el.amount), 0);
  }, [expenses]);

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
    { title: "Комментарий", dataIndex: "comment", key: "comment" },
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
      title: "🧑‍💻",
      key: "actions",
      render: (_, record) => (
        <div className="icons">
          <EditTwoTone onClick={() => showEditModal(record)} />
          <DeleteOutlined
            onClick={() => handleDeleteExpense(record.id)}
            style={{ color: "red", marginLeft: "15px" }}
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
    pageSize: 7, // Количество элементов на странице
    total: expenses.length, // Общее количество элементов
    showSizeChanger: true, // Показывает опцию выбора количества элементов на странице
    pageSizeOptions: ['5', '10', '20'], // Опции для выбора размера страницы
  };

  return (
    <>
      <Table pagination={paginationConfig}  responsive dataSource={expenses} columns={columns} rowKey="id" />
      <Text  style={{ 
        color: 'green',
        fontSize: '20px',
        position: 'relative', 
        top: '-49px',  // Устанавливает отступ сверху (поднимет элемент)
        left: '0px'   // Можно также настроить отступ слева
  }} keyboard>Сумма за период: {formatAmount(total)}</Text>
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
