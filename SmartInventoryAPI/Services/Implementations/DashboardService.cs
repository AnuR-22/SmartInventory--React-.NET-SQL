using SmartInventoryAPI.Dtos;
using SmartInventoryAPI.Repositories.Interfaces;
using SmartInventoryAPI.Services.Interfaces;

namespace SmartInventoryAPI.Services.Implementations
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _repository;

        public DashboardService(IDashboardRepository repository) => _repository = repository;

        public Task<DashboardSummaryDto> GetSummaryAsync() => _repository.GetSummaryAsync();
    }
}
