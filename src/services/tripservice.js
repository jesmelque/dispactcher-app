
// services/tripService.js
import axios from 'axios';
 
const API_BASE_URL = 'http://192.168.100.33:8000';
 
/**
 * GET /dashboard/trips/
 * Returns all trips with booking_ref, addresses, date, time, price, distance, duration, driver
 */
export const getTrips = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/trips/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
 
/**
 * GET /dashboard/trips/?id=<tripId>
 * Returns a single trip by its numeric id
 */
export const getTripById = async (tripId, token) => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/trips/`, {
    params: { id: tripId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
 
/**
 * GET /dashboard/trips/by-date/?date=YYYY-MM-DD
 * Returns all trips scheduled on a specific date
 */
export const getTripsByDate = async (date, token) => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/trips/by-date/`, {
    params: { date },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
 
/**
 * PUT /dashboard/bookings/?ref=<bookingRef>
 * Updates the booking status to "accepted"
 */
export const acceptBooking = async (bookingRef, token) => {
  const response = await axios.put(
    `${API_BASE_URL}/dashboard/bookings/`,
    { status: 'accepted' },
    {
      params: { ref: bookingRef },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
 
/**
 * PUT /dashboard/bookings/?ref=<bookingRef>
 * Updates the booking status to "rejected"
 */
export const rejectBooking = async (bookingRef, token) => {
  const response = await axios.put(
    `${API_BASE_URL}/dashboard/bookings/`,
    { status: 'rejected' },
    {
      params: { ref: bookingRef },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};