using SmartInventoryAPI.Dtos;

namespace SmartInventoryAPI.Repositories.Interfaces
{
    public interface IDashboardRepository
    {
        Task<DashboardSummaryDto> GetSummaryAsync();
    }
}
