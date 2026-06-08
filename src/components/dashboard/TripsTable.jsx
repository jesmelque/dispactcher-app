import {
  Box,
  Chip,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

import { useEffect, useRef, useState } from 'react';

const API_URL = '/api/trips';
const WS_URL = 'ws://localhost:4000'; // future backend

const mockData = [
  {
    tripId: 'TR-10024',
    client: 'Hassan Ibrahim',
    pickup: 'St Mary Hospital',
    dropoff: 'Phoenix Rehab Center',
    driver: 'AbdiKarim Ali',
    status: 'Picked Up',
  },
];

const statusColors = {
  Reserved: '#38BDF8',
  'Picked Up': '#06B6D4',
  'In Transit': '#F59E0B',
  Completed: '#22C55E',
  Cancelled: '#EF4444',
  'No Show': '#FB7185',
};

export default function TripsTable() {
  const [rows, setRows] = useState([]);
  const wsRef = useRef(null);

  // Merge logic (prevents duplicates)
  const mergeTrips = (newTrips) => {
    setRows((prev) => {
      const map = new Map();

      [...newTrips, ...prev].forEach((trip) => {
        map.set(trip.tripId, { ...map.get(trip.tripId), ...trip });
      });

      return Array.from(map.values());
    });
  };

  // REST fallback load
  const loadTrips = async () => {
    try {
      const res = await fetch(API_URL);

      if (!res.ok) throw new Error('API not ready');

      const data = await res.json();
      setRows(data);
    } catch {
      setRows(mockData);
    }
  };

  // WebSocket connection (REAL-TIME)
  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          /**
           * Expected backend format:
           * {
           *   type: "trip_update" | "trip_create",
           *   data: {...trip}
           * }
           */
          if (message.type === 'trip_update' || message.type === 'trip_create') {
            mergeTrips([message.data]);
          }

          if (message.type === 'trip_bulk') {
            mergeTrips(message.data);
          }
        } catch (err) {
          console.error('WS parse error', err);
        }
      };

      ws.onerror = () => {
        console.warn('WebSocket error, falling back to REST');
      };

      ws.onclose = () => {
        console.warn('WebSocket closed');
      };
    } catch (err) {
      console.warn('WebSocket not available');
    }
  };

  useEffect(() => {
    loadTrips();
    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: 560,
        borderRadius: '24px',
        p: 3,
        background: 'rgba(8,18,36,.72)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(56,189,248,.10)',
      }}
    >
      <Typography
        sx={{
          color: '#EAF4FF',
          fontSize: '1.05rem',
          fontWeight: 700,
          mb: 2,
        }}
      >
        Live Trips Board
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#8CA3C7' }}>Trip ID</TableCell>
            <TableCell sx={{ color: '#8CA3C7' }}>Client</TableCell>
            <TableCell sx={{ color: '#8CA3C7' }}>Pick Up</TableCell>
            <TableCell sx={{ color: '#8CA3C7' }}>Drop Off</TableCell>
            <TableCell sx={{ color: '#8CA3C7' }}>Driver</TableCell>
            <TableCell sx={{ color: '#8CA3C7' }}>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.tripId} hover>
              <TableCell sx={{ color: '#EAF4FF' }}>{row.tripId}</TableCell>
              <TableCell sx={{ color: '#DCE8F8' }}>{row.client}</TableCell>
              <TableCell sx={{ color: '#DCE8F8' }}>{row.pickup}</TableCell>
              <TableCell sx={{ color: '#DCE8F8' }}>{row.dropoff}</TableCell>
              <TableCell sx={{ color: '#DCE8F8' }}>{row.driver}</TableCell>

              <TableCell>
                <Chip
                  label={row.status}
                  size="small"
                  sx={{
                    color: statusColors[row.status] || '#fff',
                    backgroundColor: `${statusColors[row.status] || '#fff'}15`,
                    border: `1px solid ${statusColors[row.status] || '#fff'}30`,
                    fontWeight: 700,
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}