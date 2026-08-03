using SmartInventoryAPI.Dtos;

namespace SmartInventoryAPI.Services.Interfaces
{
    public interface IAssetService
    {
        Task<List<AssetDto>> GetAllAsync(AssetFilterDto filter);
        Task<AssetDto?> GetByIdAsync(int id);
        Task<AssetDto> CreateAsync(CreateAssetDto dto);
        Task<AssetDto?> UpdateAsync(int id, UpdateAssetDto dto);
        Task<bool> DeleteAsync(int id);
        Task<byte[]?> GenerateQrCodeAsync(int id);
        Task<AssetDetailDto?> GetDetailByTagAsync(string assetTag);
    }
}
