import Box from '@mui/material/Box';
import { tokens } from '../theme/theme';

const statusStyles: Record<string, { bg: string; fg: string }> = {
  Available: { bg: tokens.greenBg, fg: tokens.green },
  Assigned: { bg: tokens.blueBg, fg: tokens.blue },
  Repair: { bg: tokens.amberBg, fg: tokens.amber },
  'In Progress': { bg: tokens.amberBg, fg: tokens.amber },
  Retired: { bg: tokens.rustBg, fg: tokens.rust },
  Unrepairable: { bg: tokens.rustBg, fg: tokens.rust },
  Completed: { bg: tokens.greenBg, fg: tokens.green },
};

interface StatusChipProps {
  status: string;
}

export default function StatusChip({ status }: StatusChipProps) {
  const style = statusStyles[status] || { bg: '#EEE', fg: tokens.slate };
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.6,
        px: 1.1,
        py: 0.35,
        borderRadius: 999,
        backgroundColor: style.bg,
        color: style.fg,
        fontSize: '0.72rem',
        fontWeight: 600,
        lineHeight: 1,
      }}
    >
      <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: style.fg }} />
      {status}
    </Box>
  );
}
