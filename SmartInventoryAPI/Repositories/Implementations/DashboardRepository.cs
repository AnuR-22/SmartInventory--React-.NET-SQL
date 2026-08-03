using System.Data;
using SmartInventoryAPI.Dtos;
using SmartInventoryAPI.Repositories.Interfaces;

namespace SmartInventoryAPI.Repositories.Implementations
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly string _connectionString;

        public DashboardRepository(IConfiguration config) =>
            _connectionString = config.GetConnectionString("DefaultConnection")!;

        public async Task<DashboardSummaryDto> GetSummaryAsync()
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_GetDashboardSummary", conn) { CommandType = CommandType.StoredProcedure };
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new DashboardSummaryDto
                {
                    TotalAssets = reader.GetInt32(0),
                    AvailableAssets = reader.GetInt32(1),
                    AssignedAssets = reader.GetInt32(2),
                    InRepairAssets = reader.GetInt32(3),
                    RetiredAssets = reader.GetInt32(4),
                    WarrantyExpiringSoon = reader.GetInt32(5)
                };
            }
            return new DashboardSummaryDto();
        }
    }
}
