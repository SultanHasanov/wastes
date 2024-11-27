import React from "react";
import { Input, Button, Form } from "antd";

export const ExpenseForm = ({ onAddExpense, initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues); // Устанавливаем начальные значения, если они есть
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    onAddExpense({ ...values, date: initialValues?.date || new Date().toISOString() });
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="inline">
      <Form.Item name="comment" rules={[{ required: true, message: "Введите комментарий" }]}>
        <Input placeholder="Комментарий" />
      </Form.Item>
      <Form.Item name="amount" rules={[{ required: true, message: "Введите сумму" }]}>
        <Input type="number" placeholder="Сумма" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Сохранить
        </Button>
      </Form.Item>
    </Form>
  );
};
