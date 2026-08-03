export type AssetStatus = 'Available' | 'Assigned' | 'Repair' | 'Retired';

export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface Vendor {
  vendorId: number;
  vendorName: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface Employee {
  employeeId: number;
  fullName: string;
  email: string;
  departmentId: number;
  departmentName?: string;
  isActive: boolean;
}

export interface Asset {
  assetId: number;
  assetTag: string;
  assetName: string;
  categoryId: number;
  categoryName?: string;
  serialNumber?: string;
  vendorId?: number;
  vendorName?: string;
  purchaseDate: string;
  purchaseCost: number;
  warrantyEndDate?: string;
  status: AssetStatus;
  qrCodeData?: string;
}

export interface Assignment {
  assignmentId: number;
  assetId: number;
  assetTag?: string;
  assetName?: string;
  employeeId: number;
  employeeName?: string;
  assignedDate: string;
  returnedDate?: string;
  conditionOnReturn?: string;
}

export type RepairStatus = 'In Progress' | 'Completed' | 'Unrepairable';

export interface Repair {
  repairId: number;
  assetId: number;
  assetTag?: string;
  assetName?: string;
  vendorId?: number;
  vendorName?: string;
  issueDescription: string;
  sentDate: string;
  returnedDate?: string;
  cost?: number;
  status: RepairStatus;
}

export interface DashboardSummary {
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  inRepairAssets: number;
  retiredAssets: number;
  warrantyExpiringSoon: number;
}
