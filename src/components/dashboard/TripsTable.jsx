import {
  Box,
  Chip,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';


import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';


import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTrips, acceptBooking, rejectBooking } from '../../services/tripservice';


// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_META = {
  received:         { label: 'Received',    color: '#38BDF8' },
  accepted:         { label: 'Accepted',    color: '#22C55E' },
  rejected:         { label: 'Rejected',    color: '#EF4444' },
  dispatch_failed:  { label: 'Disp. Failed', color: '#FB923C' },
  completed:        { label: 'Completed',   color: '#10B981' },
  cancelled:        { label: 'Cancelled',   color: '#bf00f4' },
};

const statusMeta = (status) =>
  STATUS_META[status?.toLowerCase()] ?? { label: status ?? '—', color: '#8CA3C7' };

// Statuses that a dispatcher can act on
const ACTIONABLE = new Set(['received', 'dispatch_failed']);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = {
  date: (d) => {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  },
  time: (t) => {
    if (!t) return '—';
    const [h, min] = t.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${min} ${ampm}`;
  },
  price: (p) => (p != null ? `$${parseFloat(p).toFixed(2)}` : '—'),
  distance: (d) => (d != null ? `${parseFloat(d).toFixed(1)} mi` : '—'),
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function TripsTable() {
  const { token } = useAuth();

  const [trips, setTrips]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState('');
  // Track per-booking action state: { [bookingRef]: 'accepting' | 'rejecting' | null }
  const [actionState, setAction]  = useState({});

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchTrips = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTrips(token);
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg =
        err?.response?.status === 401
          ? 'Session expired — please log in again.'
          : err?.response?.status === 403
          ? 'You do not have permission to view trips.'
          : 'Could not load trips. Check your connection and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // ── Accept / Reject ────────────────────────────────────────────────────────
  const handleAccept = async (bookingRef) => {
    setAction((prev) => ({ ...prev, [bookingRef]: 'accepting' }));
    try {
      await acceptBooking(bookingRef, token);
      // Optimistic update: mark all trips with this booking_ref as accepted
      setTrips((prev) =>
        prev.map((t) =>
          t.booking_ref === bookingRef ? { ...t, booking_status: 'accepted' } : t
        )
      );
    } catch (err) {
      setError(`Failed to accept booking ${bookingRef}. Please try again.`);
    } finally {
      setAction((prev) => ({ ...prev, [bookingRef]: null }));
    }
  };

  const handleReject = async (bookingRef) => {
    setAction((prev) => ({ ...prev, [bookingRef]: 'rejecting' }));
    try {
      await rejectBooking(bookingRef, token);
      setTrips((prev) =>
        prev.map((t) =>
          t.booking_ref === bookingRef ? { ...t, booking_status: 'rejected' } : t
        )
      );
    } catch (err) {
      setError(`Failed to reject booking ${bookingRef}. Please try again.`);
    } finally {
      setAction((prev) => ({ ...prev, [bookingRef]: null }));
    }
  };

  // ── Derive booking status from a trip ─────────────────────────────────────
  // The Trip serializer doesn't return booking.status directly, only booking_ref.
  // We track it in the local state key `booking_status` after actions; on first
  // load we infer it from the trip itself (fallback: 'received').
  const getBookingStatus = (trip) => trip.booking_status ?? 'received';

  // ── Filter ─────────────────────────────────────────────────────────────────
  const q = search.toLowerCase();
  const filtered = trips.filter((t) => {
    if (!q) return true;
    return (
      t.booking_ref?.toLowerCase().includes(q) ||
      t.pick_up_address?.toLowerCase().includes(q) ||
      t.drop_off_address?.toLowerCase().includes(q) ||
      t.driver?.toLowerCase().includes(q)
    );
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        minHeight: 520,
        borderRadius: '24px',
        p: 3,
        background: 'rgba(8,18,36,.72)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(56,189,248,.10)',
      }}
    >
      {/* Header row */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        gap={2}
        flexWrap="wrap"
      >
        <Typography sx={{ color: '#EAF4FF', fontSize: '1.05rem', fontWeight: 700 }}>
          Booked Trips
        </Typography>

        <Stack direction="row" alignItems="center" gap={1}>
          <TextField
            size="small"
            placeholder="Search trips…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#8CA3C7', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 220,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                fontSize: '0.85rem',
                color: '#DCE8F8',
                background: 'rgba(255,255,255,0.04)',
                '& fieldset': { borderColor: 'rgba(56,189,248,.18)' },
                '&:hover fieldset': { borderColor: 'rgba(56,189,248,.35)' },
              },
            }}
          />

          <Tooltip title="Refresh">
            <span>
              <IconButton
                size="small"
                onClick={fetchTrips}
                disabled={loading}
                sx={{ color: '#38BDF8', '&:hover': { background: 'rgba(56,189,248,.10)' } }}
              >
                {loading ? (
                  <CircularProgress size={16} sx={{ color: '#38BDF8' }} />
                ) : (
                  <RefreshIcon fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Error banner */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ mb: 2, borderRadius: '12px', fontSize: '0.82rem' }}
        >
          {error}
        </Alert>
      )}

      {/* Loading skeleton */}
      {loading && trips.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={32} sx={{ color: '#38BDF8' }} />
        </Box>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ color: '#8CA3C7', fontSize: '0.9rem' }}>
            {search ? 'No trips match your search.' : 'No trips booked yet.'}
          </Typography>
        </Box>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  'Booking Ref',
                  'Pick Up',
                  'Drop Off',
                  'Date',
                  'Time',
                  'Distance',
                  'Price',
                  'Driver',
                  'Status',
                  'Actions',
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: '#8CA3C7',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      py: 1.2,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((trip) => {
                const bookingStatus = getBookingStatus(trip);
                const { label, color } = statusMeta(bookingStatus);
                const isBusy   = !!actionState[trip.booking_ref];
                const canAct   = ACTIONABLE.has(bookingStatus.toLowerCase()) && !isBusy;
                const isAccepting = actionState[trip.booking_ref] === 'accepting';
                const isRejecting = actionState[trip.booking_ref] === 'rejecting';

                return (
                  <TableRow
                    key={trip.id}
                    hover
                    sx={{
                      '&:hover td': { background: 'rgba(56,189,248,.04)' },
                      opacity: bookingStatus === 'rejected' ? 0.55 : 1,
                      transition: 'opacity .2s',
                    }}
                  >
                    {/* Booking Ref */}
                    <TableCell sx={{ color: '#38BDF8', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {trip.booking_ref ?? '—'}
                    </TableCell>

                    {/* Pick Up */}
                    <TableCell sx={{ color: '#DCE8F8', fontSize: '0.8rem', maxWidth: 180 }}>
                      <Tooltip title={trip.pick_up_address ?? ''} placement="top">
                        <Box
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: 160,
                          }}
                        >
                          {trip.pick_up_address ?? '—'}
                        </Box>
                      </Tooltip>
                    </TableCell>

                    {/* Drop Off */}
                    <TableCell sx={{ color: '#DCE8F8', fontSize: '0.8rem', maxWidth: 180 }}>
                      <Tooltip title={trip.drop_off_address ?? ''} placement="top">
                        <Box
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: 160,
                          }}
                        >
                          {trip.drop_off_address ?? '—'}
                        </Box>
                      </Tooltip>
                    </TableCell>

                    {/* Date */}
                    <TableCell sx={{ color: '#DCE8F8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {fmt.date(trip.date)}
                    </TableCell>

                    {/* Time */}
                    <TableCell sx={{ color: '#DCE8F8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {fmt.time(trip.time)}
                    </TableCell>

                    {/* Distance */}
                    <TableCell sx={{ color: '#DCE8F8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {fmt.distance(trip.distance)}
                    </TableCell>

                    {/* Price */}
                    <TableCell sx={{ color: '#22C55E', fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {fmt.price(trip.price)}
                    </TableCell>

                    {/* Driver */}
                    <TableCell sx={{ color: '#DCE8F8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {trip.driver ?? (
                        <Typography component="span" sx={{ color: '#8CA3C7', fontStyle: 'italic', fontSize: '0.78rem' }}>
                          Unassigned
                        </Typography>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={label}
                        size="small"
                        sx={{
                          color: color,
                          backgroundColor: `${color}18`,
                          border: `1px solid ${color}35`,
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          height: 22,
                        }}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Stack direction="row" gap={0.5} alignItems="center">
                        {/* Accept */}
                        <Tooltip title={canAct ? `Accept booking ${trip.booking_ref}` : ''}>
                          <span>
                            <IconButton
                              size="small"
                              disabled={!canAct}
                              onClick={() => handleAccept(trip.booking_ref)}
                              sx={{
                                color: '#22C55E',
                                '&:hover': { background: 'rgba(34,197,94,.12)' },
                                '&.Mui-disabled': { opacity: 0.25 },
                              }}
                            >
                              {isAccepting ? (
                                <CircularProgress size={14} sx={{ color: '#22C55E' }} />
                              ) : (
                                <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>

                        {/* Reject */}
                        <Tooltip title={canAct ? `Reject booking ${trip.booking_ref}` : ''}>
                          <span>
                            <IconButton
                              size="small"
                              disabled={!canAct}
                              onClick={() => handleReject(trip.booking_ref)}
                              sx={{
                                color: '#EF4444',
                                '&:hover': { background: 'rgba(239,68,68,.12)' },
                                '&.Mui-disabled': { opacity: 0.25 },
                              }}
                            >
                              {isRejecting ? (
                                <CircularProgress size={14} sx={{ color: '#EF4444' }} />
                              ) : (
                                <CancelOutlinedIcon sx={{ fontSize: 18 }} />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      )}

      {/* Footer count */}
      {filtered.length > 0 && (
        <Typography sx={{ color: '#8CA3C7', fontSize: '0.75rem', mt: 1.5, textAlign: 'right' }}>
          {filtered.length} trip{filtered.length !== 1 ? 's' : ''}
          {search ? ` matching "${search}"` : ' total'}
        </Typography>
      )}
    </Box>
  );
}
