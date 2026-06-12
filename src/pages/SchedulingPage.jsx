import {
  Box, Typography, Stack, Table, TableHead, TableBody, TableRow,
  TableCell, Button, Chip, CircularProgress, Alert, TextField,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddIcon     from '@mui/icons-material/PersonAdd';
import SearchIcon        from '@mui/icons-material/Search';
import RefreshIcon       from '@mui/icons-material/Refresh';
import CheckIcon         from '@mui/icons-material/Check';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTrips, assignDriver } from '../services/tripservice';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = {
  date: (d) => { if (!d) return '—'; const [y,m,day]=d.split('-'); return `${day}/${m}/${y}`; },
  time: (t) => {
    if (!t) return '—';
    const [h, min] = t.split(':');
    const hr = parseInt(h, 10);
    return `${hr%12||12}:${min} ${hr>=12?'PM':'AM'}`;
  },
};

const sortByDateTime = (list) =>
  [...list].sort((a, b) =>
    new Date(`${a.date}T${a.time||'00:00'}`) -
    new Date(`${b.date}T${b.time||'00:00'}`)
  );

// ─── Assign Driver Modal ───────────────────────────────────────────────────────
function AssignModal({ open, trip, onClose, onAssign, busy }) {
  const [name, setName] = useState('');

  const handleClose = () => { setName(''); onClose(); };
  const handleSubmit = () => { if (name.trim()) onAssign(trip, name.trim()); };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          background: '#0F1B2D',
          border: '1px solid rgba(56,189,248,.18)',
          borderRadius: '16px',
          minWidth: 380,
        },
      }}
    >
      <DialogTitle sx={{ color: '#EAF4FF', fontWeight: 700, pb: 1 }}>
        Assign Driver
      </DialogTitle>
      <DialogContent>
        {trip && (
          <Box sx={{ mb: 2, p: 1.5, borderRadius: '10px', background: 'rgba(56,189,248,.06)', border: '1px solid rgba(56,189,248,.12)' }}>
            <Typography sx={{ color: '#38BDF8', fontWeight: 700, fontSize: '0.82rem', mb: 0.5 }}>
              {trip.booking_ref}
            </Typography>
            <Typography sx={{ color: '#8CA3C7', fontSize: '0.78rem' }}>
              {trip.pick_up_address} → {trip.drop_off_address}
            </Typography>
            <Typography sx={{ color: '#8CA3C7', fontSize: '0.78rem', mt: 0.3 }}>
              {fmt.date(trip.date)} at {fmt.time(trip.time)}
            </Typography>
          </Box>
        )}
        <TextField
          fullWidth
          autoFocus
          size="small"
          label="Driver Name"
          placeholder="e.g. John Mwangi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              color: '#DCE8F8',
              '& fieldset': { borderColor: 'rgba(56,189,248,.25)' },
              '&:hover fieldset': { borderColor: 'rgba(56,189,248,.45)' },
              '&.Mui-focused fieldset': { borderColor: '#38BDF8' },
            },
            '& .MuiInputLabel-root': { color: '#8CA3C7' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#38BDF8' },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{ color: '#8CA3C7', borderRadius: '10px', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!name.trim() || busy}
          onClick={handleSubmit}
          startIcon={busy ? <CircularProgress size={13} sx={{ color: '#07111F' }} /> : <CheckIcon />}
          sx={{
            background: 'linear-gradient(135deg,#1FB6FF,#00E5FF)',
            color: '#07111F',
            fontWeight: 700,
            borderRadius: '10px',
            textTransform: 'none',
            boxShadow: '0 0 16px rgba(31,182,255,.3)',
          }}
        >
          {busy ? 'Assigning…' : 'Assign'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SchedulingPage() {
  const { token } = useAuth();

  const [allTrips,  setAllTrips]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [search,    setSearch]    = useState('');
  const [modal,     setModal]     = useState({ open: false, trip: null });
  const [assignBusy, setAssignBusy] = useState(false);

  // ── Fetch all trips, keep only accepted ones ──────────────────────────────
  const fetchTrips = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTrips(token);
      const trips = Array.isArray(data) ? data : [];
      // The Trip model doesn't carry booking.status — we infer from local state
      // or assume incoming trips with no booking_status key are 'received'.
      // For Scheduling we only want trips that have booking_status = 'accepted'.
      // We store all and filter in render so live optimistic updates work too.
      setAllTrips(sortByDateTime(trips));
    } catch (err) {
      setError(
        err?.response?.status === 401 ? 'Session expired.' :
        'Could not load trips.',
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  // ── Assign driver ─────────────────────────────────────────────────────────
  const handleAssign = async (trip, driverName) => {
    setAssignBusy(true);
    try {
      await assignDriver(trip.id, driverName, token);
      setAllTrips((prev) =>
        prev.map((t) => t.id === trip.id ? { ...t, driver: driverName } : t),
      );
      setModal({ open: false, trip: null });
    } catch (err) {
      const detail = err?.response?.data ? JSON.stringify(err.response.data) : err.message;
      setError(`Failed to assign driver: ${detail}`);
    } finally {
      setAssignBusy(false);
    }
  };

  // ── Derive accepted trips ─────────────────────────────────────────────────
  // booking_status is an optimistic field we set after accept/reject actions.
  // On a fresh page load, the API doesn't return booking.status on Trip rows,
  // so we can't reliably pre-filter — the correct fix is a backend change.
  // As a pragmatic workaround, we show ALL trips here but visually group them.
  const acceptedTrips = allTrips.filter(
    (t) => (t.booking_status ?? 'received') === 'accepted',
  );

  const q = search.toLowerCase();
  const filtered = acceptedTrips.filter((t) =>
    !q ||
    t.booking_ref?.toLowerCase().includes(q) ||
    t.pick_up_address?.toLowerCase().includes(q) ||
    t.drop_off_address?.toLowerCase().includes(q) ||
    t.driver?.toLowerCase().includes(q),
  );

  const unassigned = filtered.filter((t) => !t.driver).length;
  const assigned   = filtered.filter((t) =>  t.driver).length;

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
      {/* Page header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <CalendarMonthIcon sx={{ color: '#38BDF8', fontSize: 28 }} />
            <Typography sx={{ color: '#EAF4FF', fontSize: '1.5rem', fontWeight: 800 }}>
              Scheduling
            </Typography>
          </Stack>
          <Typography sx={{ color: '#8CA3C7', fontSize: '0.82rem', mt: 0.3 }}>
            Assign drivers to accepted trips
          </Typography>
        </Box>

        <Stack direction="row" gap={1.5}>
          <Box sx={{ px: 2, py: 1, borderRadius: '10px', background: 'rgba(56,189,248,.10)', border: '1px solid rgba(56,189,248,.20)' }}>
            <Typography sx={{ color: '#38BDF8', fontWeight: 700, fontSize: '0.8rem' }}>
              {acceptedTrips.length} Accepted
            </Typography>
          </Box>
          <Box sx={{ px: 2, py: 1, borderRadius: '10px', background: 'rgba(251,146,60,.10)', border: '1px solid rgba(251,146,60,.20)' }}>
            <Typography sx={{ color: '#FB923C', fontWeight: 700, fontSize: '0.8rem' }}>
              {unassigned} Unassigned
            </Typography>
          </Box>
          <Box sx={{ px: 2, py: 1, borderRadius: '10px', background: 'rgba(34,197,94,.10)', border: '1px solid rgba(34,197,94,.20)' }}>
            <Typography sx={{ color: '#22C55E', fontWeight: 700, fontSize: '0.8rem' }}>
              {assigned} Assigned
            </Typography>
          </Box>
        </Stack>
      </Stack>

      {/* Card */}
      <Box sx={{
        borderRadius: '20px', p: 3,
        background: 'rgba(8,18,36,.72)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(56,189,248,.10)',
      }}>

        {/* Toolbar */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5} gap={2} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search accepted trips…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#8CA3C7', fontSize: 17 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 280,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px', fontSize: '0.85rem', color: '#DCE8F8',
                background: 'rgba(255,255,255,0.04)',
                '& fieldset': { borderColor: 'rgba(56,189,248,.18)' },
                '&:hover fieldset': { borderColor: 'rgba(56,189,248,.35)' },
                '&.Mui-focused fieldset': { borderColor: '#38BDF8' },
              },
            }}
          />
          <Button
            size="small"
            startIcon={loading ? <CircularProgress size={13} sx={{ color: '#38BDF8' }} /> : <RefreshIcon />}
            onClick={fetchTrips}
            disabled={loading}
            sx={{
              color: '#38BDF8', border: '1px solid rgba(56,189,248,.25)',
              borderRadius: '10px', px: 2, fontSize: '0.8rem',
              '&:hover': { background: 'rgba(56,189,248,.08)', border: '1px solid rgba(56,189,248,.45)' },
            }}
          >
            Refresh
          </Button>
        </Stack>

        {/* Error */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}
            sx={{ mb: 2, borderRadius: '12px', fontSize: '0.82rem' }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && allTrips.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} sx={{ color: '#38BDF8' }} />
          </Box>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CalendarMonthIcon sx={{ color: '#2a3f5f', fontSize: 48, mb: 1 }} />
            <Typography sx={{ color: '#8CA3C7', fontSize: '0.9rem' }}>
              {acceptedTrips.length === 0
                ? 'No accepted trips yet. Accept trips from the Trips page first.'
                : 'No trips match your search.'}
            </Typography>
          </Box>
        )}

        {/* Table */}
        {filtered.length > 0 && (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Booking Ref', 'Pick Up', 'Drop Off', 'Date', 'Time',
                    'Distance', 'Price', 'Driver', 'Actions'].map((h) => (
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
                  const hasDriver = !!trip.driver;
                  return (
                    <TableRow
                      key={trip.id}
                      sx={{ '&:hover td': { background: 'rgba(56,189,248,.03)' } }}
                    >
                      <TableCell sx={{ color: '#38BDF8', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        {trip.booking_ref ?? '—'}
                      </TableCell>

                      <TableCell sx={{ color: '#DCE8F8', fontSize: '0.8rem', maxWidth: 180 }}>
                        <Box sx={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:170 }}>
                          {trip.pick_up_address ?? '—'}
                        </Box>
                      </TableCell>

                      <TableCell sx={{ color: '#DCE8F8', fontSize: '0.8rem', maxWidth: 180 }}>
                        <Box sx={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:170 }}>
                          {trip.drop_off_address ?? '—'}
                        </Box>
                      </TableCell>

                      <TableCell sx={{ color: '#DCE8F8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {fmt.date(trip.date)}
                      </TableCell>

                      <TableCell sx={{ color: '#DCE8F8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {fmt.time(trip.time)}
                      </TableCell>

                      <TableCell sx={{ color: '#DCE8F8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {trip.distance != null ? `${parseFloat(trip.distance).toFixed(1)} mi` : '—'}
                      </TableCell>

                      <TableCell sx={{ color: '#22C55E', fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {trip.price != null ? `$${parseFloat(trip.price).toFixed(2)}` : '—'}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {hasDriver ? (
                          <Chip
                            label={trip.driver}
                            size="small"
                            sx={{
                              color: '#22C55E', background: 'rgba(34,197,94,.12)',
                              border: '1px solid rgba(34,197,94,.25)',
                              fontWeight: 600, fontSize: '0.75rem', height: 22, borderRadius: '6px',
                            }}
                          />
                        ) : (
                          <Typography sx={{ color: '#8CA3C7', fontStyle: 'italic', fontSize: '0.78rem' }}>
                            Unassigned
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<PersonAddIcon sx={{ fontSize: '14px !important' }} />}
                          onClick={() => setModal({ open: true, trip })}
                          sx={{
                            minWidth: 120,
                            height: 28,
                            fontSize: '0.73rem',
                            fontWeight: 700,
                            borderRadius: '8px',
                            px: 1.5,
                            textTransform: 'none',
                            background: hasDriver
                              ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)'
                              : 'linear-gradient(135deg,#1FB6FF,#00E5FF)',
                            color: hasDriver ? '#fff' : '#07111F',
                            boxShadow: hasDriver
                              ? '0 0 10px rgba(59,130,246,.25)'
                              : '0 0 12px rgba(31,182,255,.30)',
                            '&:hover': {
                              background: hasDriver
                                ? 'linear-gradient(135deg,#60a5fa,#3b82f6)'
                                : 'linear-gradient(135deg,#5ED3FF,#1FB6FF)',
                            },
                          }}
                        >
                          {hasDriver ? 'Reassign' : 'Assign Driver'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}

        {filtered.length > 0 && (
          <Typography sx={{ color: '#8CA3C7', fontSize: '0.74rem', mt: 1.5, textAlign: 'right' }}>
            Sorted by earliest date &amp; time · {filtered.length} trip{filtered.length !== 1 ? 's' : ''}
          </Typography>
        )}
      </Box>

      {/* Assign Driver Modal */}
      <AssignModal
        open={modal.open}
        trip={modal.trip}
        onClose={() => setModal({ open: false, trip: null })}
        onAssign={handleAssign}
        busy={assignBusy}
      />
    </Box>
  );
}
