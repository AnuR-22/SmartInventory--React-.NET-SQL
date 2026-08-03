using SmartInventoryAPI.Dtos;
using SmartInventoryAPI.Models;

namespace SmartInventoryAPI.Repositories.Interfaces
{
    public interface IAssetRepository
    {
        Task<List<Asset>> GetAllAsync(AssetFilterDto filter);
        Task<Asset?> GetByIdAsync(int id);
        Task<int> CreateAsync(Asset asset);
        Task<bool> UpdateAsync(int id, Asset asset);
        Task<bool> DeleteAsync(int id);
        Task<string?> GetAssetTagAsync(int id);
        Task<AssetDetailDto?> GetDetailByTagAsync(string assetTag);
    }
}
