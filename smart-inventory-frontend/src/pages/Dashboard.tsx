import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Topbar from '../components/layout/Topbar';
import StatCard from '../components/StatCard';
import AssetTagChip from '../components/AssetTagChip';
import { tokens } from '../theme/theme';
import { getDashboardSummary } from '../services/otherApi';
import { getAssets } from '../services/assetsApi';
import type { Asset, DashboardSummary } from '../types';

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentAssets, setRecentAssets] = useState<Asset[]>([]);

  useEffect(() => {
    getDashboardSummary().then(setSummary);
    getAssets().then((assets) => setRecentAssets(assets.slice(0, 5)));
  }, []);

  const breakdown = summary
    ? [
        { label: 'Available', value: summary.availableAssets, color: tokens.green },
        { label: 'Assigned', value: summary.assignedAssets, color: tokens.blue },
        { label: 'In repair', value: summary.inRepairAssets, color: tokens.amber },
        { label: 'Retired', value: summary.retiredAssets, color: tokens.rust },
      ]
    : [];
  const maxVal = Math.max(1, ...breakdown.map((b) => b.value));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Topbar title="Dashboard" subtitle="Overview of every tagged asset in the ledger" />

      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
          <StatCard label="Total assets" value={summary?.totalAssets ?? '—'} accent={tokens.ink} icon={<Inventory2OutlinedIcon />} />
          <StatCard label="Available" value={summary?.availableAssets ?? '—'} accent={tokens.green} icon={<CheckCircleOutlineIcon />} />
          <StatCard label="Assigned" value={summary?.assignedAssets ?? '—'} accent={tokens.blue} icon={<AssignmentIndOutlinedIcon />} />
          <StatCard label="In repair" value={summary?.inRepairAssets ?? '—'} accent={tokens.amber} icon={<BuildOutlinedIcon />} />
          <StatCard label="Retired" value={summary?.retiredAssets ?? '—'} accent={tokens.rust} icon={<ArchiveOutlinedIcon />} />
          <StatCard
            label="Warranty expiring"
            value={summary?.warrantyExpiringSoon ?? '—'}
            accent={tokens.copper}
            icon={<WarningAmberOutlinedIcon />}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
          <Box
            sx={{
              flex: '1 1 380px',
              minWidth: 320,
              backgroundColor: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: tokens.ink, mb: 2.5 }}>
              Status breakdown
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
              {breakdown.map((b) => (
                <Box key={b.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography sx={{ fontSize: '0.78rem', color: tokens.slate, width: 90, flexShrink: 0 }}>
                    {b.label}
                  </Typography>
                  <Box sx={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: tokens.paper, overflow: 'hidden' }}>
                    <Box
                      sx={{
                        height: '100%',
                        borderRadius: 4,
                        backgroundColor: b.color,
                        width: `${(b.value / maxVal) * 100}%`,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: tokens.ink, width: 24, textAlign: 'right' }}>
                    {b.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              flex: '1 1 380px',
              minWidth: 320,
              backgroundColor: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: tokens.ink, mb: 2 }}>
              Recently added assets
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {recentAssets.map((asset) => (
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: tokens.ink }}>
                      {asset.assetName}
                    </Typography>
                    <AssetTagChip tag={asset.assetTag} />
                  </Box>
                  <Typography sx={{ fontSize: '0.8rem', color: tokens.slate }}>{asset.status}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
