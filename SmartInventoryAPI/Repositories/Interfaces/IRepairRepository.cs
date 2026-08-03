using SmartInventoryAPI.Models;

namespace SmartInventoryAPI.Repositories.Interfaces
{
    public interface IRepairRepository
    {
        Task<List<Repair>> GetAllAsync();
        Task<List<Repair>> GetByAssetIdAsync(int assetId);
        Task SendForRepairAsync(int assetId, int vendorId, string issueDescription);
        Task CompleteRepairAsync(int repairId, decimal cost, string status);
    }
}
