using System.Data;
using SmartInventoryAPI.Models;
using SmartInventoryAPI.Repositories.Interfaces;

namespace SmartInventoryAPI.Repositories.Implementations
{
    public class RepairRepository : IRepairRepository
    {
        private readonly string _connectionString;

        public RepairRepository(IConfiguration config) =>
            _connectionString = config.GetConnectionString("DefaultConnection")!;

        private static Repair Map(SqlDataReader r) => new Repair
        {
            RepairId = r.GetInt32(r.GetOrdinal("RepairId")),
            AssetId = r.GetInt32(r.GetOrdinal("AssetId")),
            VendorId = r.IsDBNull(r.GetOrdinal("VendorId")) ? null : r.GetInt32(r.GetOrdinal("VendorId")),
            IssueDescription = r.GetString(r.GetOrdinal("IssueDescription")),
            SentDate = r.GetDateTime(r.GetOrdinal("SentDate")),
            ReturnedDate = r.IsDBNull(r.GetOrdinal("ReturnedDate")) ? null : r.GetDateTime(r.GetOrdinal("ReturnedDate")),
            Cost = r.IsDBNull(r.GetOrdinal("Cost")) ? null : r.GetDecimal(r.GetOrdinal("Cost")),
            Status = r.GetString(r.GetOrdinal("Status"))
        };

        public async Task<List<Repair>> GetAllAsync()
        {
            var repairs = new List<Repair>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SELECT * FROM Repairs ORDER BY SentDate DESC", conn);
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync()) repairs.Add(Map(reader));
            return repairs;
        }

        public async Task<List<Repair>> GetByAssetIdAsync(int assetId)
        {
            var repairs = new List<Repair>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SELECT * FROM Repairs WHERE AssetId = @AssetId ORDER BY SentDate DESC", conn);
            cmd.Parameters.AddWithValue("@AssetId", assetId);
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync()) repairs.Add(Map(reader));
            return repairs;
        }

        public async Task SendForRepairAsync(int assetId, int vendorId, string issueDescription)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_SendForRepair", conn) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@AssetId", assetId);
            cmd.Parameters.AddWithValue("@VendorId", vendorId);
            cmd.Parameters.AddWithValue("@IssueDescription", issueDescription);
            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task CompleteRepairAsync(int repairId, decimal cost, string status)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_CompleteRepair", conn) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@RepairId", repairId);
            cmd.Parameters.AddWithValue("@Cost", cost);
            cmd.Parameters.AddWithValue("@Status", status);
            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }
    }
}
