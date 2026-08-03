using SmartInventoryAPI.Models;
using SmartInventoryAPI.Repositories.Interfaces;

namespace SmartInventoryAPI.Repositories.Implementations
{
    public class ReportRepository : IReportRepository
    {
        private readonly string _connectionString;

        public ReportRepository(IConfiguration config) =>
            _connectionString = config.GetConnectionString("DefaultConnection")!;

        public async Task<List<Asset>> GetAssetsForExportAsync()
        {
            var assets = new List<Asset>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SELECT AssetTag, AssetName, Status, PurchaseCost FROM Assets", conn);
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                assets.Add(new Asset
                {
                    AssetTag = reader.GetString(0),
                    AssetName = reader.GetString(1),
                    Status = reader.GetString(2),
                    PurchaseCost = reader.GetDecimal(3)
                });
            }
            return assets;
        }
    }
}
