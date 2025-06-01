// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE = '${API_URL}'; // Replace with your actual API URL

export const markAttendance = async () => {
  const response = await fetch(`${API_BASE}/attendance/mark`, {
    method: 'POST',
  });
  return response.json();
};

export const getTodaysAttendance = async () => {
  const response = await fetch(`${API_BASE}/attendance/today`);
  return response.json();
};

export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE}/users`);
  return response.json();
};

export const addUser = async (user) => {
  const response = await fetch(`${API_BASE}/users/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};
