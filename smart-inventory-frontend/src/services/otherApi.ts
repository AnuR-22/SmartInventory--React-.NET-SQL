import { apiClient } from './apiClient';
import type { Vendor, Employee, Category, DashboardSummary } from '../types';
import { mockVendors, mockEmployees, mockCategories, mockDashboardSummary } from '../mock/mockData';

// ---- Vendors ----
export async function getVendors(): Promise<Vendor[]> {
  try {
    const { data } = await apiClient.get<Vendor[]>('/vendors');
    return data;
  } catch {
    return mockVendors;
  }
}

export async function createVendor(vendor: Partial<Vendor>): Promise<Vendor> {
  try {
    const { data } = await apiClient.post<Vendor>('/vendors', vendor);
    return data;
  } catch {
    const newVendor = { vendorId: Math.max(0, ...mockVendors.map((v) => v.vendorId)) + 1, ...vendor } as Vendor;
    mockVendors.push(newVendor);
    return newVendor;
  }
}

export async function updateVendor(id: number, vendor: Partial<Vendor>): Promise<Vendor> {
  try {
    const { data } = await apiClient.put<Vendor>(`/vendors/${id}`, vendor);
    return data;
  } catch {
    const idx = mockVendors.findIndex((v) => v.vendorId === id);
    if (idx >= 0) mockVendors[idx] = { ...mockVendors[idx], ...vendor };
    return mockVendors[idx];
  }
}

export async function deleteVendor(id: number): Promise<void> {
  try {
    await apiClient.delete(`/vendors/${id}`);
  } catch {
    const idx = mockVendors.findIndex((v) => v.vendorId === id);
    if (idx >= 0) mockVendors.splice(idx, 1);
  }
}

// ---- Employees ----
export async function getEmployees(): Promise<Employee[]> {
  try {
    const { data } = await apiClient.get<Employee[]>('/employees');
    return data;
  } catch {
    return mockEmployees;
  }
}

export async function createEmployee(employee: Partial<Employee>): Promise<Employee> {
  try {
    const { data } = await apiClient.post<Employee>('/employees', employee);
    return data;
  } catch {
    const newEmployee = {
      employeeId: Math.max(0, ...mockEmployees.map((e) => e.employeeId)) + 1,
      isActive: true,
      ...employee,
    } as Employee;
    mockEmployees.push(newEmployee);
    return newEmployee;
  }
}

export async function deleteEmployee(id: number): Promise<void> {
  try {
    await apiClient.delete(`/employees/${id}`);
  } catch {
    const idx = mockEmployees.findIndex((e) => e.employeeId === id);
    if (idx >= 0) mockEmployees.splice(idx, 1);
  }
}

// ---- Categories ----
export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await apiClient.get<Category[]>('/categories');
    return data;
  } catch {
    return mockCategories;
  }
}

// ---- Dashboard ----
export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary');
    return data;
  } catch {
    return mockDashboardSummary;
  }
}

// ---- Reports ----
export function getExportExcelUrl(): string {
  return `${apiClient.defaults.baseURL}/reports/export-excel`;
}
