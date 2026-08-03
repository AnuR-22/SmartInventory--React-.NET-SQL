import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import Topbar from '../components/layout/Topbar';
import AssetTagChip from '../components/AssetTagChip';
import StatusChip from '../components/StatusChip';
import AssetFormDialog from '../components/AssetFormDialog';
import QrCodeDialog from '../components/QrCodeDialog';
import { tokens } from '../theme/theme';
import { getAssets, createAsset, updateAsset, deleteAsset, getQrCodeUrl } from '../services/assetsApi';
import { getCategories, getVendors } from '../services/otherApi';
import type { Asset, Category, Vendor } from '../types';

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [qrAsset, setQrAsset] = useState<Asset | null>(null);

  const loadAssets = () => {
    getAssets({
      search: search || undefined,
      status: statusFilter || undefined,
      categoryId: categoryFilter || undefined,
    }).then(setAssets);
  };

  useEffect(() => {
    getCategories().then(setCategories);
    getVendors().then(setVendors);
  }, []);

  useEffect(() => {
    loadAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, categoryFilter]);

  const handleSave = async (form: Partial<Asset>) => {
    if (editingAsset) {
      await updateAsset(editingAsset.assetId, form);
    } else {
      await createAsset(form);
    }
    setFormOpen(false);
    setEditingAsset(null);
    loadAssets();
  };

  const handleDelete = async (id: number) => {
    await deleteAsset(id);
    loadAssets();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Topbar
        title="Assets"
        subtitle={`${assets.length} tagged ${assets.length === 1 ? 'item' : 'items'} in the ledger`}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingAsset(null);
              setFormOpen(true);
            }}
            sx={{ backgroundColor: tokens.ink, '&:hover': { backgroundColor: tokens.inkLight } }}
          >
            Add asset
          </Button>
        }
      />

      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search by name or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 260, backgroundColor: tokens.surface }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: tokens.slateLight }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 160, backgroundColor: tokens.surface }}
          >
            <MenuItem value="">All statuses</MenuItem>
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Assigned">Assigned</MenuItem>
            <MenuItem value="Repair">Repair</MenuItem>
            <MenuItem value="Retired">Retired</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value ? Number(e.target.value) : '')}
            sx={{ minWidth: 180, backgroundColor: tokens.surface }}
          >
            <MenuItem value="">All categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ backgroundColor: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tag</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Purchase cost</TableCell>
                <TableCell>Warranty ends</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.assetId} hover>
                  <TableCell>
                    <AssetTagChip tag={asset.assetTag} />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: tokens.ink }}>
                      {asset.assetName}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: tokens.slateLight }}>
                      {asset.serialNumber || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.slate }}>
                    {categories.find((c) => c.categoryId === asset.categoryId)?.categoryName || '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.slate }}>
                    ${asset.purchaseCost.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: tokens.slate }}>
                    {asset.warrantyEndDate ? asset.warrantyEndDate.slice(0, 10) : '—'}
                  </TableCell>
                  <TableCell>
                    <StatusChip status={asset.status} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setQrAsset(asset)} title="View QR tag">
                      <QrCode2Icon fontSize="small" sx={{ color: tokens.slate }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingAsset(asset);
                        setFormOpen(true);
                      }}
                      title="Edit"
                    >
                      <EditOutlinedIcon fontSize="small" sx={{ color: tokens.slate }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(asset.assetId)} title="Delete">
                      <DeleteOutlineIcon fontSize="small" sx={{ color: tokens.rust }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {assets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5, color: tokens.slateLight, fontSize: '0.85rem' }}>
                    No assets match these filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>

      <AssetFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        asset={editingAsset}
        categories={categories}
        vendors={vendors}
      />
      <QrCodeDialog
        open={!!qrAsset}
        onClose={() => setQrAsset(null)}
        asset={qrAsset}
        qrUrl={qrAsset ? getQrCodeUrl(qrAsset.assetId) : undefined}
      />
    </Box>
  );
}
