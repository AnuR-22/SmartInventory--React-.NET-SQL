import { apiClient } from './apiClient';
import type { Repair, RepairStatus } from '../types';
import { mockRepairs, mockAssets } from '../mock/mockData';

export async function getRepairsByAsset(assetId: number): Promise<Repair[]> {
  try {
    const { data } = await apiClient.get<Repair[]>(`/repairs/asset/${assetId}`);
    return data;
  } catch {
    return mockRepairs.filter((r) => r.assetId === assetId);
  }
}

export async function getAllRepairs(): Promise<Repair[]> {
  try {
    const { data } = await apiClient.get<Repair[]>('/repairs');
    return data;
  } catch {
    return mockRepairs;
  }
}

export async function sendForRepair(assetId: number, vendorId: number, issueDescription: string): Promise<Repair> {
  try {
    const { data } = await apiClient.post<Repair>('/repairs/send', { assetId, vendorId, issueDescription });
    return data;
  } catch {
    const repair: Repair = {
      repairId: Math.max(0, ...mockRepairs.map((r) => r.repairId)) + 1,
      assetId,
      vendorId,
      issueDescription,
      sentDate: new Date().toISOString(),
      status: 'In Progress',
    };
    mockRepairs.push(repair);
    const asset = mockAssets.find((a) => a.assetId === assetId);
    if (asset) asset.status = 'Repair';
    return repair;
  }
}

export async function completeRepair(repairId: number, cost: number, status: RepairStatus): Promise<Repair> {
  try {
    const { data } = await apiClient.put<Repair>(`/repairs/${repairId}/complete`, { cost, status });
    return data;
  } catch {
    const repair = mockRepairs.find((r) => r.repairId === repairId);
    if (repair) {
      repair.cost = cost;
      repair.status = status;
      repair.returnedDate = new Date().toISOString();
      const asset = mockAssets.find((a) => a.assetId === repair.assetId);
      if (asset) asset.status = status === 'Unrepairable' ? 'Retired' : 'Available';
    }
    return repair as Repair;
  }
}
