import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { tokens } from '../../theme/theme';

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: tokens.paper }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
