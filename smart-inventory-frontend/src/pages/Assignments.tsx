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
import Typography from '@mui/material/Typography';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import Topbar from '../components/layout/Topbar';
import AssetTagChip from '../components/AssetTagChip';
import StatusChip from '../components/StatusChip';
import { tokens } from '../theme/theme';
import { getAssignments, assignAsset, returnAsset } from '../services/assignmentsApi';
import { getAssets } from '../services/assetsApi';
import { getEmployees } from '../services/otherApi';
import type { Assignment, Asset, Employee } from '../types';

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [returnTarget, setReturnTarget] = useState<Assignment | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<number | ''>('');
  const [selectedEmployee, setSelectedEmployee] = useState<number | ''>('');
  const [condition, setCondition] = useState('');

  const load = () => {
    getAssignments().then(setAssignments);
    getAssets().then(setAssets);
  };

  useEffect(() => {
    load();
    getEmployees().then(setEmployees);
  }, []);

  const handleAssign = async () => {
    if (!selectedAsset || !selectedEmployee) return;
    await assignAsset(Number(selectedAsset), Number(selectedEmployee));
    setAssignOpen(false);
    setSelectedAsset('');
    setSelectedEmployee('');
    load();
  };

  const handleReturn = async () => {
    if (!returnTarget) return;
    await returnAsset(returnTarget.assetId, condition);
    setReturnTarget(null);
    setCondition('');
    load();
  };

  const findAssetName = (assetId: number) => assets.find((a) => a.assetId === assetId)?.assetName || '—';
  const findAssetTag = (assetId: number) => assets.find((a) => a.assetId === assetId)?.assetTag || '—';
  const findEmployeeName = (employeeId: number) => employees.find((e) => e.employeeId === employeeId)?.fullName || '—';

  const availableAssets = assets.filter((a) => a.status === 'Available');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Topbar
        title="Assignments"
        subtitle="Who currently holds which asset"
        action={
          <Button
            variant="contained"
            startIcon={<AssignmentIndOutlinedIcon />}
            onClick={() => setAssignOpen(true)}
            sx={{ backgroundColor: tokens.ink, '&:hover': { backgroundColor: tokens.inkLight } }}
          >
            Assign asset
          </Button>
        }
      />

      <Box sx={{ p: 4 }}>
        <Box sx={{ backgroundColor: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Assigned on</TableCell>
                <TableCell>Returned on</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((a) => (
                <TableRow key={a.assignmentId} hover>
                  <TableCell>
                    <AssetTagChip tag={a.assetTag || findAssetTag(a.assetId)} />
                    <Typography sx={{ fontSize: '0.78rem', color: tokens.slate, mt: 0.5 }}>
                      {a.assetName || findAssetName(a.assetId)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.ink }}>
                    {a.employeeName || findEmployeeName(a.employeeId)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.slate }}>
                    {a.assignedDate.slice(0, 10)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.slate }}>
                    {a.returnedDate ? a.returnedDate.slice(0, 10) : '—'}
                  </TableCell>
                  <TableCell>
                    <StatusChip status={a.returnedDate ? 'Available' : 'Assigned'} />
                  </TableCell>
                  <TableCell align="right">
                    {!a.returnedDate && (
                      <Button size="small" onClick={() => setReturnTarget(a)} sx={{ color: tokens.copper, fontSize: '0.78rem' }}>
                        Mark returned
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {assignments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5, color: tokens.slateLight, fontSize: '0.85rem' }}>
                    No assignment history yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>

      {/* Assign dialog */}
      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: tokens.ink }}>Assign an asset</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, pt: 1 }}>
          <TextField
            select
            label="Available asset"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(Number(e.target.value))}
            fullWidth
            size="small"
          >
            {availableAssets.map((a) => (
              <MenuItem key={a.assetId} value={a.assetId}>
                {a.assetTag} — {a.assetName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Employee"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(Number(e.target.value))}
            fullWidth
            size="small"
          >
            {employees.map((e) => (
              <MenuItem key={e.employeeId} value={e.employeeId}>
                {e.fullName}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setAssignOpen(false)} sx={{ color: tokens.slate }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssign}
            sx={{ backgroundColor: tokens.ink, '&:hover': { backgroundColor: tokens.inkLight } }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Return dialog */}
      <Dialog open={!!returnTarget} onClose={() => setReturnTarget(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: tokens.ink }}>Return asset</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            label="Condition on return"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            fullWidth
            size="small"
            multiline
            minRows={2}
            placeholder="e.g. Good condition, minor scratches"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setReturnTarget(null)} sx={{ color: tokens.slate }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleReturn}
            sx={{ backgroundColor: tokens.ink, '&:hover': { backgroundColor: tokens.inkLight } }}
          >
            Confirm return
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
