import {
  Box, Chip, Typography, Table, TableHead, TableBody, TableRow,
  TableCell, Button, Tooltip, CircularProgress, Alert, Stack,
  TextField, InputAdornment,
} from '@mui/material';

import RefreshIcon     from '@mui/icons-material/Refresh';
import SearchIcon      from '@mui/icons-material/Search';
import CheckIcon       from '@mui/icons-material/Check';
import CloseIcon       from '@mui/icons-material/Close';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTrips, acceptBooking, rejectBooking } from '../services/tripservice';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_META = {
  received:        { label: 'Received',     color: '#38BDF8' },
  accepted:        { label: 'Accepted',     color: '#22C55E' },
  rejected:        { label: 'Rejected',     color: '#EF4444' },
  dispatch_failed: { label: 'Disp. Failed', color: '#FB923C' },
  completed:       { label: 'Completed',    color: '#10B981' },
  cancelled:       { label: 'Cancelled',    color: '#bf00f4' },
};

const statusMeta = (s) =>
  STATUS_META[s?.toLowerCase()] ?? { label: s ?? '—', color: '#8CA3C7' };

// Only these statuses show active Accept / Reject buttons
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
    return `${hour % 12 || 12}:${min} ${hour >= 12 ? 'PM' : 'AM'}`;
  },
  price:    (p) => (p != null ? `$${parseFloat(p).toFixed(2)}` : '—'),
  distance: (d) => (d != null ? `${parseFloat(d).toFixed(1)} mi` : '—'),
};

// Sort trips: soonest date+time first
const sortTrips = (list) =>
  [...list].sort((a, b) => {
    const da = new Date(`${a.date}T${a.time || '00:00'}`);
    const db = new Date(`${b.date}T${b.time || '00:00'}`);
    return da - db;
  });

// ─── BookingStatusBadge ───────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const { label, color } = statusMeta(status);
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        color,
        backgroundColor: `${color}18`,
        border: `1px solid ${color}35`,
        fontWeight: 700,
        fontSize: '0.72rem',
        height: 22,
        borderRadius: '6px',
      }}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TripsPage() {
  const { token } = useAuth();

  const [trips,       setTrips]   = useState([]);
  const [loading,     setLoading] = useState(true);
  const [error,       setError]   = useState(null);
  const [search,      setSearch]  = useState('');
  // { [bookingRef]: 'accepting' | 'rejecting' | undefined }
  const [actionState, setAction]  = useState({});

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchTrips = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTrips(token);
      setTrips(sortTrips(Array.isArray(data) ? data : []));
    } catch (err) {
      setError(
        err?.response?.status === 401 ? 'Session expired — please log in again.' :
        err?.response?.status === 403 ? 'You do not have permission to view trips.' :
        'Could not load trips. Check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  // ── Accept ─────────────────────────────────────────────────────────────────
  const handleAccept = async (bookingRef) => {
    setAction((p) => ({ ...p, [bookingRef]: 'accepting' }));
    try {
      await acceptBooking(bookingRef, token);
      setTrips((prev) =>
        prev.map((t) =>
          t.booking_ref === bookingRef ? { ...t, booking_status: 'accepted' } : t,
        ),
      );
    } catch (err) {
      const detail = err?.response?.data
        ? JSON.stringify(err.response.data)
        : err.message;
      setError(`Could not accept ${bookingRef}: ${detail}`);
    } finally {
      setAction((p) => ({ ...p, [bookingRef]: undefined }));
    }
  };

  // ── Reject ─────────────────────────────────────────────────────────────────
  const handleReject = async (bookingRef) => {
    setAction((p) => ({ ...p, [bookingRef]: 'rejecting' }));
    try {
      await rejectBooking(bookingRef, token);
      setTrips((prev) =>
        prev.map((t) =>
          t.booking_ref === bookingRef ? { ...t, booking_status: 'rejected' } : t,
        ),
      );
    } catch (err) {
      const detail = err?.response?.data
        ? JSON.stringify(err.response.data)
        : err.message;
      setError(`Could not reject ${bookingRef}: ${detail}`);
    } finally {
      setAction((p) => ({ ...p, [bookingRef]: undefined }));
    }
  };

  const getStatus = (trip) => trip.booking_status ?? 'received';

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

  const pendingCount  = trips.filter((t) => ACTIONABLE.has(getStatus(t))).length;
  const acceptedCount = trips.filter((t) => getStatus(t) === 'accepted').length;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: 3,
        py: 3,
        background: `
          radial-gradient(circle at top right, rgba(31,182,255,0.10), transparent 25%),
          linear-gradient(180deg, #07111F 0%, #091A2F 100%)
        `,
      }}
    >
     {/* ── Page header (IMPROVED NEMT DASHBOARD LAYOUT) ───────────────────── */}
<Box
  sx={{
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
    alignItems: 'center',
    mb: 3,
    gap: 2,
  }}
>

  {/* LEFT: Title */}
  <Box>
    <Stack direction="row" alignItems="center" gap={1.5}>
      <AirportShuttleIcon sx={{ color: '#38BDF8', fontSize: 32 }} />
      <Typography sx={{ color: '#EAF4FF', fontSize: '1.65rem', fontWeight: 800 }}>
            Trips
      </Typography>
    </Stack>

    <Typography sx={{ color: '#8CA3C7', fontSize: '0.85rem', mt: 0.6 }}>
      Review and manage all dispatched NEMT trips
    </Typography>
  </Box>

  {/* CENTER: KPI STATS (perfectly balanced) */}
  <Stack
    direction="row"
    justifyContent="center"
    spacing={2}
    sx={{
      width: '100%',
    }}
  >
    <Box
      sx={{
        px: 2.5,
        py: 1.2,
        borderRadius: '14px',
        background: 'rgba(56,189,248,.08)',
        border: '1px solid rgba(56,189,248,.25)',
        minWidth: 110,
        textAlign: 'center',
      }}
    >
      <Typography sx={{ color: '#38BDF8', fontWeight: 800, fontSize: '0.85rem' }}>
        {trips.length}
      </Typography>
      <Typography sx={{ color: '#8CA3C7', fontSize: '0.7rem' }}>
        Total
      </Typography>
    </Box>

    <Box
      sx={{
        px: 2.5,
        py: 1.2,
        borderRadius: '14px',
        background: 'rgba(251,146,60,.08)',
        border: '1px solid rgba(251,146,60,.25)',
        minWidth: 110,
        textAlign: 'center',
      }}
    >
      <Typography sx={{ color: '#FB923C', fontWeight: 800, fontSize: '0.85rem' }}>
        {pendingCount}
      </Typography>
      <Typography sx={{ color: '#8CA3C7', fontSize: '0.7rem' }}>
        Pending
      </Typography>
    </Box>

    <Box
      sx={{
        px: 2.5,
        py: 1.2,
        borderRadius: '14px',
        background: 'rgba(34,197,94,.08)',
        border: '1px solid rgba(34,197,94,.25)',
        minWidth: 110,
        textAlign: 'center',
      }}
    >
      <Typography sx={{ color: '#22C55E', fontWeight: 800, fontSize: '0.85rem' }}>
        {acceptedCount}
      </Typography>
      <Typography sx={{ color: '#8CA3C7', fontSize: '0.7rem' }}>
        Accepted
      </Typography>
    </Box>
  </Stack>

  {/* RIGHT: visual balance spacer (keeps center truly centered) */}
  <Box sx={{ display: { xs: 'none', md: 'block' } }} />
</Box>


{/* ── Main card ──────────────────────────────────────────────────────── */}
<Box
  sx={{
    borderRadius: '20px',
    p: 3,
    background: 'rgba(8,18,36,.72)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(56,189,248,.10)',
  }}
>

        {/* Table */}
        {filtered.length > 0 && (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Booking Ref', 'Pick Up', 'Drop Off', 'Date', 'Time',
                    'Distance', 'Price', 'Driver', 'Status', 'Actions'].map((h) => (
                    <TableCell key={h} sx={{
                      color: '#8CA3C7', fontWeight: 700, fontSize: '0.73rem',
                      whiteSpace: 'nowrap', py: 1.4, textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((trip) => {
                  const bookingStatus  = getStatus(trip);
                  const isBusy        = !!actionState[trip.booking_ref];
                  const canAct        = ACTIONABLE.has(bookingStatus) && !isBusy;
                  const isAccepting   = actionState[trip.booking_ref] === 'accepting';
                  const isRejecting   = actionState[trip.booking_ref] === 'rejecting';

                  return (
                    <TableRow
                      key={trip.id}
                      sx={{
                        opacity: bookingStatus === 'rejected' ? 0.5 : 1,
                        transition: 'opacity .2s, background .15s',
                        '&:hover td': { background: 'rgba(56,189,248,.03)' },
                      }}
                    >
                      {/* Booking Ref */}
                      <TableCell sx={{ color: '#38BDF8', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        {trip.booking_ref ?? '—'}
                      </TableCell>

                      {/* Pick Up */}
                      <TableCell sx={{ color: '#DCE8F8', fontSize: '0.8rem', maxWidth: 180 }}>
                        <Tooltip title={trip.pick_up_address ?? ''} placement="top">
                          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 170 }}>
                            {trip.pick_up_address ?? '—'}
                          </Box>
                        </Tooltip>
                      </TableCell>

                      {/* Drop Off */}
                      <TableCell sx={{ color: '#DCE8F8', fontSize: '0.8rem', maxWidth: 180 }}>
                        <Tooltip title={trip.drop_off_address ?? ''} placement="top">
                          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 170 }}>
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

                      {/* Status chip */}
                      <TableCell>
                        <StatusBadge status={bookingStatus} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <Stack direction="row" gap={0.75} alignItems="center">
                          {/* Accept button */}
                          <Button
                            size="small"
                            variant="contained"
                            disabled={!canAct}
                            onClick={() => handleAccept(trip.booking_ref)}
                            startIcon={
                              isAccepting
                                ? <CircularProgress size={11} sx={{ color: '#07111F' }} />
                                : <CheckIcon sx={{ fontSize: '14px !important' }} />
                            }
                            sx={{
                              minWidth: 88,
                              height: 28,
                              fontSize: '0.73rem',
                              fontWeight: 700,
                              borderRadius: '8px',
                              px: 1.5,
                              background: canAct
                                ? 'linear-gradient(135deg,#22C55E,#16a34a)'
                                : 'rgba(34,197,94,.12)',
                              color: canAct ? '#fff' : 'rgba(34,197,94,.35)',
                              boxShadow: canAct ? '0 0 12px rgba(34,197,94,.25)' : 'none',
                              textTransform: 'none',
                              '&:hover': {
                                background: canAct ? 'linear-gradient(135deg,#4ade80,#22C55E)' : undefined,
                              },
                              '&.Mui-disabled': { opacity: 1 },
                            }}
                          >
                            {isAccepting ? 'Accepting…' : 'Accept'}
                          </Button>

                          {/* Reject button */}
                          <Button
                            size="small"
                            variant="contained"
                            disabled={!canAct}
                            onClick={() => handleReject(trip.booking_ref)}
                            startIcon={
                              isRejecting
                                ? <CircularProgress size={11} sx={{ color: '#fff' }} />
                                : <CloseIcon sx={{ fontSize: '14px !important' }} />
                            }
                            sx={{
                              minWidth: 82,
                              height: 28,
                              fontSize: '0.73rem',
                              fontWeight: 700,
                              borderRadius: '8px',
                              px: 1.5,
                              background: canAct
                                ? 'linear-gradient(135deg,#EF4444,#b91c1c)'
                                : 'rgba(239,68,68,.10)',
                              color: canAct ? '#fff' : 'rgba(239,68,68,.35)',
                              boxShadow: canAct ? '0 0 12px rgba(239,68,68,.20)' : 'none',
                              textTransform: 'none',
                              '&:hover': {
                                background: canAct ? 'linear-gradient(135deg,#f87171,#EF4444)' : undefined,
                              },
                              '&.Mui-disabled': { opacity: 1 },
                            }}
                          >
                            {isRejecting ? 'Rejecting…' : 'Reject'}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <Typography sx={{ color: '#8CA3C7', fontSize: '0.74rem', mt: 1.5, textAlign: 'right' }}>
            Sorted by earliest date &amp; time · {filtered.length} trip{filtered.length !== 1 ? 's' : ''}
            {search ? ` matching "${search}"` : ''}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
