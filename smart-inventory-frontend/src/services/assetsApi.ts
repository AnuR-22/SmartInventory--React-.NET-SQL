import { apiClient } from './apiClient';
import type { Asset } from '../types';
import { mockAssets } from '../mock/mockData';

export interface AssetFilters {
  status?: string;
  categoryId?: number;
  search?: string;
}

export async function getAssets(filters: AssetFilters = {}): Promise<Asset[]> {
  try {
    const { data } = await apiClient.get<Asset[]>('/assets', { params: filters });
    return data;
  } catch {
    // Backend not connected — fall back to bundled mock data so the UI stays demoable.
    let result = [...mockAssets];
    if (filters.status) result = result.filter((a) => a.status === filters.status);
    if (filters.categoryId) result = result.filter((a) => a.categoryId === filters.categoryId);
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (a) => a.assetName.toLowerCase().includes(term) || a.assetTag.toLowerCase().includes(term)
      );
    }
    return result;
  }
}

export async function createAsset(asset: Partial<Asset>): Promise<Asset> {
  try {
    const { data } = await apiClient.post<Asset>('/assets', asset);
    return data;
  } catch {
    const newAsset: Asset = {
      assetId: Math.max(0, ...mockAssets.map((a) => a.assetId)) + 1,
      status: 'Available',
      ...asset,
    } as Asset;
    mockAssets.push(newAsset);
    return newAsset;
  }
}

export async function updateAsset(id: number, asset: Partial<Asset>): Promise<Asset> {
  try {
    const { data } = await apiClient.put<Asset>(`/assets/${id}`, asset);
    return data;
  } catch {
    const idx = mockAssets.findIndex((a) => a.assetId === id);
    if (idx >= 0) mockAssets[idx] = { ...mockAssets[idx], ...asset };
    return mockAssets[idx];
  }
}

export async function deleteAsset(id: number): Promise<void> {
  try {
    await apiClient.delete(`/assets/${id}`);
  } catch {
    const idx = mockAssets.findIndex((a) => a.assetId === id);
    if (idx >= 0) mockAssets.splice(idx, 1);
  }
}

export function getQrCodeUrl(id: number): string {
  return `${apiClient.defaults.baseURL}/assets/${id}/qrcode`;
}
