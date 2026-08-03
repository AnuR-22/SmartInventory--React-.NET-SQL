import type {
  Asset,
  Assignment,
  Category,
  DashboardSummary,
  Employee,
  Repair,
  Vendor,
} from '../types';

export const mockCategories: Category[] = [
  { categoryId: 1, categoryName: 'Laptop' },
  { categoryId: 2, categoryName: 'Monitor' },
  { categoryId: 3, categoryName: 'Keyboard' },
  { categoryId: 4, categoryName: 'Software License' },
];

export const mockVendors: Vendor[] = [
  { vendorId: 1, vendorName: 'Dell Enterprise', contactName: 'Vendor Rep A', phone: '555-1111', email: '[email protected]', address: '123 Tech Park' },
  { vendorId: 2, vendorName: 'HP Service Center', contactName: 'Vendor Rep B', phone: '555-2222', email: '[email protected]', address: '456 Service Rd' },
];

export const mockEmployees: Employee[] = [
  { employeeId: 1, fullName: 'John Doe', email: '[email protected]', departmentId: 1, departmentName: 'IT', isActive: true },
  { employeeId: 2, fullName: 'Jane Smith', email: '[email protected]', departmentId: 2, departmentName: 'HR', isActive: true },
  { employeeId: 3, fullName: 'Robert Lee', email: '[email protected]', departmentId: 3, departmentName: 'Finance', isActive: true },
];

export const mockAssets: Asset[] = [
  { assetId: 1, assetTag: 'AST-0001', assetName: 'Dell Latitude 5440', categoryId: 1, categoryName: 'Laptop', serialNumber: 'SN-DL5440-001', vendorId: 1, vendorName: 'Dell Enterprise', purchaseDate: '2024-01-15', purchaseCost: 950, warrantyEndDate: '2027-01-15', status: 'Assigned', qrCodeData: 'AST-0001' },
  { assetId: 2, assetTag: 'AST-0002', assetName: 'HP 24-inch Monitor', categoryId: 2, categoryName: 'Monitor', serialNumber: 'SN-HPMON-002', vendorId: 2, vendorName: 'HP Service Center', purchaseDate: '2024-03-10', purchaseCost: 180, warrantyEndDate: '2026-03-10', status: 'Available', qrCodeData: 'AST-0002' },
  { assetId: 3, assetTag: 'AST-0003', assetName: 'Logitech Keyboard', categoryId: 3, categoryName: 'Keyboard', serialNumber: 'SN-LGKB-003', purchaseDate: '2024-05-01', purchaseCost: 25, status: 'Available', qrCodeData: 'AST-0003' },
  { assetId: 4, assetTag: 'AST-0004', assetName: 'MacBook Pro 14', categoryId: 1, categoryName: 'Laptop', serialNumber: 'SN-MBP14-004', vendorId: 1, vendorName: 'Dell Enterprise', purchaseDate: '2025-01-10', purchaseCost: 2200, warrantyEndDate: '2028-01-10', status: 'Repair', qrCodeData: 'AST-0004' },
  { assetId: 5, assetTag: 'AST-0005', assetName: 'Office 365 License', categoryId: 4, categoryName: 'Software License', purchaseDate: '2024-06-01', purchaseCost: 150, warrantyEndDate: '2025-08-15', status: 'Available', qrCodeData: 'AST-0005' },
];

export const mockAssignments: Assignment[] = [
  { assignmentId: 1, assetId: 1, assetTag: 'AST-0001', assetName: 'Dell Latitude 5440', employeeId: 1, employeeName: 'John Doe', assignedDate: '2024-02-01' },
];

export const mockRepairs: Repair[] = [
  { repairId: 1, assetId: 4, assetTag: 'AST-0004', assetName: 'MacBook Pro 14', vendorId: 1, vendorName: 'Dell Enterprise', issueDescription: 'Screen flickering intermittently', sentDate: '2025-07-01', status: 'In Progress' },
];

export const mockDashboardSummary: DashboardSummary = {
  totalAssets: mockAssets.length,
  availableAssets: mockAssets.filter((a) => a.status === 'Available').length,
  assignedAssets: mockAssets.filter((a) => a.status === 'Assigned').length,
  inRepairAssets: mockAssets.filter((a) => a.status === 'Repair').length,
  retiredAssets: mockAssets.filter((a) => a.status === 'Retired').length,
  warrantyExpiringSoon: 1,
};
