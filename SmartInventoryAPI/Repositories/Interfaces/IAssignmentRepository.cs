using SmartInventoryAPI.Models;

namespace SmartInventoryAPI.Repositories.Interfaces
{
    public interface IAssignmentRepository
    {
        Task<List<Assignment>> GetAllAsync();
        Task AssignAsync(int assetId, int employeeId);
        Task ReturnAsync(int assetId, string conditionOnReturn);
    }
}
