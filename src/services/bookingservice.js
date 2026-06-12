import api from './api';

export const getBookings = async () => {
  const response = await api.get(
    '/dashboard/bookings/'
  );

  return response.data;
};

export const acceptBooking = async (
  bookingRef
) => {
  const response = await api.put(
    `/dashboard/bookings/?ref=${bookingRef}`,
    {
      status: 'reserved',
    }
  );

  return response.data;
};

export const rejectBooking = async (
  bookingRef
) => {
  const response = await api.put(
    `/dashboard/bookings/?ref=${bookingRef}`,
    {
      status: 'cancelled',
    }
  );

  return response.data;
};