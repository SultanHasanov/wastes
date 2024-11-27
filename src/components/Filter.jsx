import React from "react";
import { Select } from "antd";

export const Filter = ({ setFilter }) => {
  
  return (
    <Select
      onChange={(value) => setFilter(value)}
      defaultValue="all"
      style={{ width: 200, marginBottom: 20 }}
    >
      <Select.Option value="all">Все</Select.Option>
      <Select.Option value="today">Сегодня</Select.Option>
      <Select.Option value="week">Неделя</Select.Option>
      <Select.Option value="month">Месяц</Select.Option>
    </Select>
  );
};
