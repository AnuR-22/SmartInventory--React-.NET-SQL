import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { tokens } from '../../theme/theme';

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function Topbar({ title, subtitle, action }: TopbarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        py: 3,
        borderBottom: `1px solid ${tokens.border}`,
        backgroundColor: tokens.surface,
      }}
    >
      <Box>
        <Typography sx={{ fontSize: '1.35rem', fontWeight: 700, color: tokens.ink }}>{title}</Typography>
        {subtitle && (
          <Typography sx={{ fontSize: '0.85rem', color: tokens.slate, mt: 0.25 }}>{subtitle}</Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {action}
        <Avatar sx={{ width: 34, height: 34, backgroundColor: tokens.ink, fontSize: '0.85rem', fontWeight: 600 }}>
          AM
        </Avatar>
      </Box>
    </Box>
  );
}
