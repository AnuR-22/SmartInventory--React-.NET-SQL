import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '../theme/theme';

interface StatCardProps {
  label: string;
  value: number | string;
  accent?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, accent = tokens.ink, icon }: StatCardProps) {
  return (
    <Box
      sx={{
        flex: '1 1 180px',
        minWidth: 180,
        backgroundColor: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 2,
        p: 2.25,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', backgroundColor: accent }} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: tokens.slate,
          }}
        >
          {label}
        </Typography>
        {icon && <Box sx={{ color: accent, display: 'flex' }}>{icon}</Box>}
      </Box>
      <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: tokens.ink, lineHeight: 1 }}>{value}</Typography>
    </Box>
  );
}
