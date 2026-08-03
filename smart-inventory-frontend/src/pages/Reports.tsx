import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Topbar from '../components/layout/Topbar';
import AssetTagChip from '../components/AssetTagChip';
import { tokens } from '../theme/theme';
import { getExportExcelUrl } from '../services/otherApi';
import { getAssets } from '../services/assetsApi';
import type { Asset } from '../types';

export default function Reports() {
  const [expiring, setExpiring] = useState<Asset[]>([]);

  useEffect(() => {
    getAssets().then((assets) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + 60);
      setExpiring(
        assets.filter((a) => a.warrantyEndDate && new Date(a.warrantyEndDate) <= cutoff)
      );
    });
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Topbar title="Reports" subtitle="Export data and review upcoming warranty expirations" />

      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box
          sx={{
            backgroundColor: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: 2,
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: tokens.ink }}>
              Full asset export
            </Typography>
            <Typography sx={{ fontSize: '0.82rem', color: tokens.slate, mt: 0.5 }}>
              Download every asset record as an Excel workbook.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<FileDownloadOutlinedIcon />}
            href={getExportExcelUrl()}
            target="_blank"
            rel="noopener"
            sx={{ backgroundColor: tokens.ink, '&:hover': { backgroundColor: tokens.inkLight } }}
          >
            Export to Excel
          </Button>
        </Box>

        <Box
          sx={{
            backgroundColor: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: 2,
            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <WarningAmberOutlinedIcon sx={{ color: tokens.copper, fontSize: 20 }} />
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: tokens.ink }}>
              Warranty expiring within 60 days
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {expiring.map((asset) => (
              <Box
                key={asset.assetId}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1,
                  borderBottom: `1px solid ${tokens.border}`,
                  '&:last-of-type': { borderBottom: 'none' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AssetTagChip tag={asset.assetTag} />
                  <Typography sx={{ fontSize: '0.85rem', color: tokens.ink }}>{asset.assetName}</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.8rem', color: tokens.copperDark, fontWeight: 600 }}>
                  {asset.warrantyEndDate?.slice(0, 10)}
                </Typography>
              </Box>
            ))}
            {expiring.length === 0 && (
              <Typography sx={{ fontSize: '0.85rem', color: tokens.slateLight, py: 2 }}>
                No assets have warranties expiring soon.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
