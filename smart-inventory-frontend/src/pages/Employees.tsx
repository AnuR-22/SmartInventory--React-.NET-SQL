import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Topbar from '../components/layout/Topbar';
import StatusChip from '../components/StatusChip';
import { tokens } from '../theme/theme';
import { getEmployees, createEmployee, deleteEmployee } from '../services/otherApi';
import type { Employee } from '../types';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState('1');

  const load = () => getEmployees().then(setEmployees);

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    await createEmployee({ fullName, email, departmentId: Number(departmentId), isActive: true });
    setFormOpen(false);
    setFullName('');
    setEmail('');
    load();
  };

  const handleDelete = async (id: number) => {
    await deleteEmployee(id);
    load();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Topbar
        title="Employees"
        subtitle="Staff who can receive asset assignments"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
            sx={{ backgroundColor: tokens.ink, '&:hover': { backgroundColor: tokens.inkLight } }}
          >
            Add employee
          </Button>
        }
      />

      <Box sx={{ p: 4 }}>
        <Box sx={{ backgroundColor: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((e) => (
                <TableRow key={e.employeeId} hover>
                  <TableCell sx={{ fontSize: '0.85rem', fontWeight: 500, color: tokens.ink }}>{e.fullName}</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.slate }}>{e.email}</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.slate }}>{e.departmentName || e.departmentId}</TableCell>
                  <TableCell>
                    <StatusChip status={e.isActive ? 'Available' : 'Retired'} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleDelete(e.employeeId)}>
                      <DeleteOutlineIcon fontSize="small" sx={{ color: tokens.rust }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: tokens.ink }}>Add employee</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, pt: 1 }}>
          <TextField label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth size="small" />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth size="small" />
          <TextField
            label="Department ID"
            type="number"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            fullWidth
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setFormOpen(false)} sx={{ color: tokens.slate }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ backgroundColor: tokens.ink, '&:hover': { backgroundColor: tokens.inkLight } }}
          >
            Add employee
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
