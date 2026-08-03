import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import type { Asset, Category, Vendor } from '../types';
import { tokens } from '../theme/theme';

interface AssetFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (asset: Partial<Asset>) => void;
  asset?: Asset | null;
  categories: Category[];
  vendors: Vendor[];
}

const emptyForm: Partial<Asset> = {
  assetTag: '',
  assetName: '',
  categoryId: undefined,
  serialNumber: '',
  vendorId: undefined,
  purchaseDate: '',
  purchaseCost: 0,
  warrantyEndDate: '',
};

export default function AssetFormDialog({ open, onClose, onSave, asset, categories, vendors }: AssetFormDialogProps) {
  const [form, setForm] = useState<Partial<Asset>>(emptyForm);

  useEffect(() => {
    setForm(asset ? { ...asset } : emptyForm);
  }, [asset, open]);

  const handleChange = (field: keyof Asset) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'categoryId' || field === 'vendorId' || field === 'purchaseCost'
      ? Number(e.target.value)
      : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700, color: tokens.ink }}>
        {asset ? 'Edit asset' : 'Add new asset'}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, pt: 1 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Asset tag"
            value={form.assetTag || ''}
            onChange={handleChange('assetTag')}
            fullWidth
            size="small"
            placeholder="AST-0006"
          />
          <TextField
            label="Serial number"
            value={form.serialNumber || ''}
            onChange={handleChange('serialNumber')}
            fullWidth
            size="small"
          />
        </Box>
        <TextField
          label="Asset name"
          value={form.assetName || ''}
          onChange={handleChange('assetName')}
          fullWidth
          size="small"
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            select
            label="Category"
            value={form.categoryId ?? ''}
            onChange={handleChange('categoryId')}
            fullWidth
            size="small"
          >
            {categories.map((c) => (
              <MenuItem key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Vendor"
            value={form.vendorId ?? ''}
            onChange={handleChange('vendorId')}
            fullWidth
            size="small"
          >
            {vendors.map((v) => (
              <MenuItem key={v.vendorId} value={v.vendorId}>
                {v.vendorName}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Purchase date"
            type="date"
            value={form.purchaseDate ? form.purchaseDate.slice(0, 10) : ''}
            onChange={handleChange('purchaseDate')}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Purchase cost"
            type="number"
            value={form.purchaseCost ?? ''}
            onChange={handleChange('purchaseCost')}
            fullWidth
            size="small"
          />
        </Box>
        <TextField
          label="Warranty end date"
          type="date"
          value={form.warrantyEndDate ? form.warrantyEndDate.slice(0, 10) : ''}
          onChange={handleChange('warrantyEndDate')}
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: tokens.slate }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave(form)}
          sx={{ backgroundColor: tokens.ink, '&:hover': { backgroundColor: tokens.inkLight } }}
        >
          {asset ? 'Save changes' : 'Add asset'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
