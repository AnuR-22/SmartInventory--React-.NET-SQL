import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Asset } from '../types';
import { tokens } from '../theme/theme';
import AssetTagChip from './AssetTagChip';

interface QrCodeDialogProps {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
  qrUrl?: string;
}

// Renders a simple placeholder pattern standing in for the real QR image served
// by GET /api/assets/{id}/qrcode on the .NET backend (not included in this package).
export default function QrCodeDialog({ open, onClose, asset, qrUrl }: QrCodeDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: tokens.ink }}>Asset tag</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
        <Box
          sx={{
            width: 180,
            height: 180,
            border: `1px dashed ${tokens.slateLight}`,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tokens.paper,
            overflow: 'hidden',
          }}
        >
          {qrUrl ? (
            <img src={qrUrl} alt={`QR code for ${asset?.assetTag}`} style={{ width: '100%', height: '100%' }} />
          ) : (
            <Typography sx={{ fontSize: '0.75rem', color: tokens.slateLight, textAlign: 'center', px: 2 }}>
              QR image served by the backend endpoint /api/assets/{'{id}'}/qrcode
            </Typography>
          )}
        </Box>
        {asset && <AssetTagChip tag={asset.assetTag} />}
        {asset && <Typography sx={{ fontSize: '0.85rem', color: tokens.slate }}>{asset.assetName}</Typography>}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: tokens.slate }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
