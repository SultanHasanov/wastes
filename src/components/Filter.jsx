import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Popover } from "antd";
import { ru } from "date-fns/locale"; // Импортируем локализацию для русского языка
import "react-datepicker/dist/react-datepicker.css";

export const Filter = ({ setFilter, setShowCalendar }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      // Если выбран диапазон
      setFilter({ startDate: start, endDate: end });
    } else if (start && !end) {
      // Если выбрана только одна дата
      setFilter({ startDate: start, endDate: start });
    } else {
      // Если нет дат
      setFilter({ startDate: null, endDate: null });
    }
  };

  const content = (
    <DatePicker
      selected={startDate}
      onChange={handleDateChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      inline
      dateFormat="dd/MM/yyyy"
      locale={ru} // Устанавливаем русскую локализацию
    />
  );

  const handlePopoverVisibleChange = (visible) => {
    setShowCalendar(visible); // Передаем состояние, чтобы управлять отступом
  };

  return (
    <Popover
      content={content}
      trigger="click" // Календарь откроется при клике
      placement="bottom" // Расположение поповера
      onVisibleChange={handlePopoverVisibleChange}
    >
      <span style={{ cursor: "pointer", color: "#1890ff" }}>
        Выберите период
      </span>
    </Popover>
  );
};
