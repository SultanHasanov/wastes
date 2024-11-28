import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Input, Space, message } from "antd";
import axios from "axios";
import { ExpensesPage } from "./pages/ExpensesPage";

const { Title, Text } = Typography;

const BASE_URL = "https://gatewayapi.telegram.org/";
const TOKEN = "AAHkCAAAQYk2l3sh4ky7v-sTrqZ3MRw5RpCoz9BKM_aLsg";
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

const App = () => {
  return (
    <div style={{ padding: "10px" }}>
      <AuthWrapper>
        <ExpensesPage />
      </AuthWrapper>
    </div>
  );
};

const AuthWrapper = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [phone, setPhone] = useState("+7");
  const [code, setCode] = useState("");
  const [requestId, setRequestId] = useState(null);

  // Проверка сохранённых данных авторизации
  useEffect(() => {
    const savedRequestId = localStorage.getItem("request_id");
    const savedVerificationStatus = localStorage.getItem("verification_status");
    if (savedRequestId && savedVerificationStatus === "code_valid") {
      setIsAuthorized(true);
    }
  }, []);

  // Логика выхода
  const handleLogout = () => {
    localStorage.removeItem("request_id");
    localStorage.removeItem("verification_status");
    localStorage.removeItem("phone_number");
    setIsAuthorized(false);
  };

  // Отправка кода подтверждения
  const sendCode = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}sendVerificationMessage`,
        {
          phone_number: phone,
          code_length: 6,
          ttl: 60,
          payload: "auth_request",
        },
        { headers: HEADERS }
      );
      if (response.data.ok) {
        setRequestId(response.data.result.request_id);
        message.success("Код отправлен, проверьте Telegram.");
      } else {
        message.error(`Ошибка: ${response.data.error}`);
      }
    } catch (error) {
      message.error(`Ошибка: ${error.message}`);
    }
  };

  // Проверка кода подтверждения
  const verifyCode = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}checkVerificationStatus`,
        {
          request_id: requestId,
          code: code,
        },
        { headers: HEADERS }
      );
      if (response.data.ok && response.data.result.verification_status.status === "code_valid") {
        localStorage.setItem("request_id", requestId);
        localStorage.setItem("verification_status", "code_valid");
        localStorage.setItem("phone_number", phone);
        setIsAuthorized(true);
        message.success("Код подтверждён!");
      } else {
        message.error("Неверный код.");
      }
    } catch (error) {
      message.error(`Ошибка: ${error.message}`);
    }
  };

  // Обработка номера телефона
  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/[^\d]/g, ""); // Оставляем только цифры
    const sanitizedInput = input.startsWith("7")
      ? input.slice(0, 11)
      : "7" + input.slice(0, 10); // Принудительно добавляем "7"
    setPhone(`+${sanitizedInput}`);
  };

  // Если не авторизован — показываем форму
  if (!isAuthorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" }}>
        <Card style={{ width: 400 }}>
          <Title level={3}>Авторизация через Telegram</Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text>Телефон:</Text>
            <Input type="tel" value={phone} onChange={handlePhoneChange} />
            <Button type="primary" block onClick={sendCode}>
              Отправить код
            </Button>
            <Text>Введите код:</Text>
            <Input
            type='number'
              placeholder="6-значный код"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button type="primary" block onClick={verifyCode}>
              Подтвердить
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  // Если авторизован — возвращаем детей и передаём `onLogout`
  return React.cloneElement(children, { onLogout: handleLogout });
};

export default App;
