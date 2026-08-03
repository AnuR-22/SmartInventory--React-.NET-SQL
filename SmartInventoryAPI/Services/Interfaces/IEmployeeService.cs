using SmartInventoryAPI.Dtos;

namespace SmartInventoryAPI.Services.Interfaces
{
    public interface IEmployeeService
    {
        Task<List<EmployeeDto>> GetAllAsync();
        Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
