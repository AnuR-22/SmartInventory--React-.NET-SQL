import axios from 'axios';

// Points at the .NET Core Web API. Not included in this frontend-only package —
// set VITE_API_BASE_URL in a .env file once the backend is running.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://smartinventory-react-net-sql-1.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});
