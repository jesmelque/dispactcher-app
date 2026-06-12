// services/tripservice.js
import axios from 'axios';

const API_BASE_URL = 'http://192.168.100.33:8000';

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/** GET /dashboard/trips/ — all trips, sorted by date+time */
export const getTrips = async (token) => {
  const res = await axios.get(`${API_BASE_URL}/dashboard/trips/`, authHeaders(token));
  return res.data;
};

/** GET /dashboard/trips/?id=<id> — single trip */
export const getTripById = async (id, token) => {
  const res = await axios.get(`${API_BASE_URL}/dashboard/trips/`, {
    params: { id },
    ...authHeaders(token),
  });
  return res.data;
};

/** GET /dashboard/bookings/?ref=<ref> — full booking with status */
export const getBooking = async (ref, token) => {
  const res = await axios.get(`${API_BASE_URL}/dashboard/bookings/`, {
    params: { ref },
    ...authHeaders(token),
  });
  return res.data;
};

/**
 * PUT /dashboard/bookings/?ref=<ref>  { status: "accepted" }
 * NOTE: The dashboard BookingSerializer lists `payment_status` which is
 * commented-out on the model — this causes a server error if you send
 * a full payload. We send ONLY `status` so DRF partial-updates cleanly.
 */
export const acceptBooking = async (ref, token) => {
  const res = await axios.put(
    `${API_BASE_URL}/dashboard/bookings/`,
    { status: 'accepted' },
    { params: { ref }, ...authHeaders(token) },
  );
  return res.data;
};

/** PUT /dashboard/bookings/?ref=<ref>  { status: "rejected" } */
export const rejectBooking = async (ref, token) => {
  const res = await axios.put(
    `${API_BASE_URL}/dashboard/bookings/`,
    { status: 'rejected' },
    { params: { ref }, ...authHeaders(token) },
  );
  return res.data;
};

/** PUT /dashboard/trips/?id=<id>  { driver: "Name" } — assign a driver */
export const assignDriver = async (tripId, driverName, token) => {
  const res = await axios.put(
    `${API_BASE_URL}/dashboard/trips/`,
    { driver: driverName },
    { params: { id: tripId }, ...authHeaders(token) },
  );
  return res.data;
};
