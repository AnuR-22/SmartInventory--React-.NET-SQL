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
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Topbar from '../components/layout/Topbar';
import { tokens } from '../theme/theme';
import { getVendors, createVendor, updateVendor, deleteVendor } from '../services/otherApi';
import type { Vendor } from '../types';

const emptyForm: Partial<Vendor> = { vendorName: '', contactName: '', phone: '', email: '', address: '' };

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [form, setForm] = useState<Partial<Vendor>>(emptyForm);

  const load = () => getVendors().then(setVendors);

  useEffect(() => {
    load();
  }, []);

  const openForm = (vendor?: Vendor) => {
    setEditing(vendor || null);
    setForm(vendor || emptyForm);
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      await updateVendor(editing.vendorId, form);
    } else {
      await createVendor(form);
    }
    setFormOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    await deleteVendor(id);
    load();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Topbar
        title="Vendors"
        subtitle="Suppliers and repair partners"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openForm()}
            sx={{ backgroundColor: tokens.ink, '&:hover': { backgroundColor: tokens.inkLight } }}
          >
            Add vendor
          </Button>
        }
      />

      <Box sx={{ p: 4 }}>
        <Box sx={{ backgroundColor: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.map((v) => (
                <TableRow key={v.vendorId} hover>
                  <TableCell sx={{ fontSize: '0.85rem', fontWeight: 500, color: tokens.ink }}>{v.vendorName}</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.slate }}>{v.contactName || '—'}</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.slate }}>{v.phone || '—'}</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.slate }}>{v.email || '—'}</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.slate }}>{v.address || '—'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openForm(v)}>
                      <EditOutlinedIcon fontSize="small" sx={{ color: tokens.slate }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(v.vendorId)}>
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
        <DialogTitle sx={{ fontWeight: 700, color: tokens.ink }}>{editing ? 'Edit vendor' : 'Add vendor'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, pt: 1 }}>
          <TextField
            label="Vendor name"
            value={form.vendorName || ''}
            onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="Contact name"
            value={form.contactName || ''}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
            fullWidth
            size="small"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Phone"
              value={form.phone || ''}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Email"
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
              size="small"
            />
          </Box>
          <TextField
            label="Address"
            value={form.address || ''}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
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
            {editing ? 'Save changes' : 'Add vendor'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
