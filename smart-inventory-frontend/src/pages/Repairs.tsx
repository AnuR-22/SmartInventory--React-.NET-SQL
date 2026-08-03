import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import Topbar from '../components/layout/Topbar';
import AssetTagChip from '../components/AssetTagChip';
import StatusChip from '../components/StatusChip';
import { tokens } from '../theme/theme';
import { getAllRepairs, sendForRepair, completeRepair } from '../services/repairsApi';
import { getAssets } from '../services/assetsApi';
import { getVendors } from '../services/otherApi';
import type { Repair, Asset, Vendor, RepairStatus } from '../types';

export default function Repairs() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [sendOpen, setSendOpen] = useState(false);
  const [completeTarget, setCompleteTarget] = useState<Repair | null>(null);

  const [selectedAsset, setSelectedAsset] = useState<number | ''>('');
  const [selectedVendor, setSelectedVendor] = useState<number | ''>('');
  const [issue, setIssue] = useState('');

  const [cost, setCost] = useState('');
  const [status, setStatus] = useState<RepairStatus>('Completed');

  const load = () => {
    getAllRepairs().then(setRepairs);
    getAssets().then(setAssets);
  };

  useEffect(() => {
    load();
    getVendors().then(setVendors);
  }, []);

  const handleSend = async () => {
    if (!selectedAsset || !selectedVendor || !issue) return;
    await sendForRepair(Number(selectedAsset), Number(selectedVendor), issue);
    setSendOpen(false);
    setSelectedAsset('');
    setSelectedVendor('');
    setIssue('');
    load();
  };

  const handleComplete = async () => {
    if (!completeTarget) return;
    await completeRepair(completeTarget.repairId, Number(cost), status);
    setCompleteTarget(null);
    setCost('');
    setStatus('Completed');
    load();
  };

  const findAssetTag = (id: number) => assets.find((a) => a.assetId === id)?.assetTag || '—';
  const findAssetName = (id: number) => assets.find((a) => a.assetId === id)?.assetName || '—';
  const findVendorName = (id?: number) => vendors.find((v) => v.vendorId === id)?.vendorName || '—';
  const repairableAssets = assets.filter((a) => a.status !== 'Repair' && a.status !== 'Retired');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Topbar
        title="Repairs"
        subtitle="Service history and open repair tickets"
        action={
          <Button
            variant="contained"
            startIcon={<BuildOutlinedIcon />}
            onClick={() => setSendOpen(true)}
            sx={{ backgroundColor: tokens.ink, '&:hover': { backgroundColor: tokens.inkLight } }}
          >
            Send for repair
          </Button>
        }
      />

      <Box sx={{ p: 4 }}>
        <Box sx={{ backgroundColor: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell>Issue</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Sent</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {repairs.map((r) => (
                <TableRow key={r.repairId} hover>
                  <TableCell>
                    <AssetTagChip tag={r.assetTag || findAssetTag(r.assetId)} />
                    <Box sx={{ fontSize: '0.78rem', color: tokens.slate, mt: 0.5 }}>
                      {r.assetName || findAssetName(r.assetId)}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.82rem', color: tokens.slate, maxWidth: 220 }}>
                    {r.issueDescription}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.ink }}>
                    {r.vendorName || findVendorName(r.vendorId)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.slate }}>{r.sentDate.slice(0, 10)}</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.slate }}>
                    {r.cost != null ? `$${r.cost.toFixed(2)}` : '—'}
                  </TableCell>
                  <TableCell>
                    <StatusChip status={r.status} />
                  </TableCell>
                  <TableCell align="right">
                    {r.status === 'In Progress' && (
                      <Button size="small" onClick={() => setCompleteTarget(r)} sx={{ color: tokens.copper, fontSize: '0.78rem' }}>
                        Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {repairs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5, color: tokens.slateLight, fontSize: '0.85rem' }}>
                    No repair records yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>

      {/* Send for repair dialog */}
      <Dialog open={sendOpen} onClose={() => setSendOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: tokens.ink }}>Send asset for repair</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, pt: 1 }}>
          <TextField
            select
            label="Asset"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(Number(e.target.value))}
            fullWidth
            size="small"
          >
            {repairableAssets.map((a) => (
              <MenuItem key={a.assetId} value={a.assetId}>
                {a.assetTag} — {a.assetName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Vendor"
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(Number(e.target.value))}
            fullWidth
            size="small"
          >
            {vendors.map((v) => (
              <MenuItem key={v.vendorId} value={v.vendorId}>
                {v.vendorName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Issue description"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            fullWidth
            size="small"
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setSendOpen(false)} sx={{ color: tokens.slate }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSend}
            sx={{ backgroundColor: tokens.ink, '&:hover': { backgroundColor: tokens.inkLight } }}
          >
            Send for repair
          </Button>
        </DialogActions>
      </Dialog>

      {/* Complete repair dialog */}
      <Dialog open={!!completeTarget} onClose={() => setCompleteTarget(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: tokens.ink }}>Complete repair</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, pt: 1 }}>
          <TextField
            label="Repair cost"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            select
            label="Outcome"
            value={status}
            onChange={(e) => setStatus(e.target.value as RepairStatus)}
            fullWidth
            size="small"
          >
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Unrepairable">Unrepairable</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setCompleteTarget(null)} sx={{ color: tokens.slate }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleComplete}
            sx={{ backgroundColor: tokens.ink, '&:hover': { backgroundColor: tokens.inkLight } }}
          >
            Save outcome
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
