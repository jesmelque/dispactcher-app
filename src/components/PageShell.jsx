import { Box, Typography } from '@mui/material';

export default function PageShell({ title }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700}>
        {title}
      </Typography>
    </Box>
  );
}