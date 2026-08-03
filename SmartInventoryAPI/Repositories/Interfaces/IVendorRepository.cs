using SmartInventoryAPI.Models;

namespace SmartInventoryAPI.Repositories.Interfaces
{
    public interface IVendorRepository
    {
        Task<List<Vendor>> GetAllAsync();
        Task<Vendor?> GetByIdAsync(int id);
        Task<int> CreateAsync(Vendor vendor);
        Task<bool> UpdateAsync(int id, Vendor vendor);
        Task<bool> DeleteAsync(int id);
    }
}
