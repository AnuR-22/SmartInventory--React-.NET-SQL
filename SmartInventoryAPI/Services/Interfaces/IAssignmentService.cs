using SmartInventoryAPI.Dtos;

namespace SmartInventoryAPI.Services.Interfaces
{
    public interface IAssignmentService
    {
        Task<List<AssignmentDto>> GetAllAsync();
        Task AssignAsync(AssignAssetDto dto);
        Task ReturnAsync(ReturnAssetDto dto);
    }
}
