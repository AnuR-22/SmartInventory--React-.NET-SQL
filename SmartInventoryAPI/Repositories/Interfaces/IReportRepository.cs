using SmartInventoryAPI.Models;

namespace SmartInventoryAPI.Repositories.Interfaces
{
    public interface IReportRepository
    {
        Task<List<Asset>> GetAssetsForExportAsync();
    }
}
