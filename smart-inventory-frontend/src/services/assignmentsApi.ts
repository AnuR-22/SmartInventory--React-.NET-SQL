import { apiClient } from './apiClient';
import type { Assignment } from '../types';
import { mockAssignments, mockAssets } from '../mock/mockData';

export async function getAssignments(): Promise<Assignment[]> {
  try {
    const { data } = await apiClient.get<Assignment[]>('/assignments');
    return data;
  } catch {
    return mockAssignments;
  }
}

export async function assignAsset(assetId: number, employeeId: number): Promise<void> {
  try {
    await apiClient.post('/assignments/assign', { assetId, employeeId });
  } catch {
    mockAssignments.push({
      assignmentId: Math.max(0, ...mockAssignments.map((a) => a.assignmentId)) + 1,
      assetId,
      employeeId,
      assignedDate: new Date().toISOString(),
    });
    const asset = mockAssets.find((a) => a.assetId === assetId);
    if (asset) asset.status = 'Assigned';
  }
}

export async function returnAsset(assetId: number, conditionOnReturn: string): Promise<void> {
  try {
    await apiClient.post('/assignments/return', { assetId, conditionOnReturn });
  } catch {
    const record = mockAssignments.find((a) => a.assetId === assetId && !a.returnedDate);
    if (record) {
      record.returnedDate = new Date().toISOString();
      record.conditionOnReturn = conditionOnReturn;
    }
    const asset = mockAssets.find((a) => a.assetId === assetId);
    if (asset) asset.status = 'Available';
  }
}
