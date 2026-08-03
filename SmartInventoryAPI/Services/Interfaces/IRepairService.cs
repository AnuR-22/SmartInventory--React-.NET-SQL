using SmartInventoryAPI.Dtos;

namespace SmartInventoryAPI.Services.Interfaces
{
    public interface IRepairService
    {
        Task<List<RepairDto>> GetAllAsync();
        Task<List<RepairDto>> GetByAssetIdAsync(int assetId);
        Task SendForRepairAsync(SendForRepairDto dto);
        Task CompleteRepairAsync(int repairId, CompleteRepairDto dto);
    }
}
