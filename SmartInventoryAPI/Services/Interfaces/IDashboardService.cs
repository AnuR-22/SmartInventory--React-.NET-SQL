using SmartInventoryAPI.Dtos;

namespace SmartInventoryAPI.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetSummaryAsync();
    }
}
