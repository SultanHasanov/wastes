const API_URL = "https://9e094e3b927ced4b.mokky.dev/items";

export const fetchExpenses = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const addExpense = async (expense) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  return await response.json();
};

export const updateExpense = async (id, expense) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  return await response.json();
};

export const deleteExpense = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
