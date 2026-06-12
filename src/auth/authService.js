import axios from 'axios';

const API_BASE_URL = 'http://192.168.100.33:8000/';

export async function login(email, password) {
  const response = await axios.post(
    `${API_BASE_URL}user/auth/login/`,
    {
      email,
      password,
    }
  );

  return response.data;
}

export async function getCurrentUser(token) {
  const response = await axios.get(
    `${API_BASE_URL}auth/me/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}