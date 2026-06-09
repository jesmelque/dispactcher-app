// services/tripService.js

import axios from 'axios';

const API_BASE_URL = 'http://192.168.100.33:8000';

export const getBookedTrips = async (token) => {
  const response = await axios.get(
    `${API_BASE_URL}/trips/booked/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const acceptTrip = async (tripId, token) => {
  const response = await axios.patch(
    `${API_BASE_URL}/trips/${tripId}/accept/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const rejectTrip = async (tripId, token) => {
  const response = await axios.patch(
    `${API_BASE_URL}/trips/${tripId}/reject/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};