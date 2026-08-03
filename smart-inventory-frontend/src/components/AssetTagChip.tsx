import Box from '@mui/material/Box';
import { tokens } from '../theme/theme';

interface AssetTagChipProps {
  tag: string;
}

// Signature element of this app: an asset tag rendered to look like a physical
// inventory/luggage tag — monospace code, a small punch-hole, dashed edge.
export default function AssetTagChip({ tag }: AssetTagChipProps) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1,
        py: 0.4,
        borderRadius: '4px 10px 10px 4px',
        border: `1px dashed ${tokens.slateLight}`,
        backgroundColor: '#FAFBFC',
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.03em',
        color: tokens.ink,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <Box
        sx={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          border: `1px solid ${tokens.slateLight}`,
          backgroundColor: tokens.paper,
          flexShrink: 0,
        }}
      />
      {tag}
    </Box>
  );
}
