using System.Data;
using SmartInventoryAPI.Models;
using SmartInventoryAPI.Repositories.Interfaces;

namespace SmartInventoryAPI.Repositories.Implementations
{
    public class AssignmentRepository : IAssignmentRepository
    {
        private readonly string _connectionString;

        public AssignmentRepository(IConfiguration config) =>
            _connectionString = config.GetConnectionString("DefaultConnection")!;

        public async Task<List<Assignment>> GetAllAsync()
        {
            var results = new List<Assignment>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SELECT * FROM Assignments ORDER BY AssignedDate DESC", conn);
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                results.Add(new Assignment
                {
                    AssignmentId = reader.GetInt32(reader.GetOrdinal("AssignmentId")),
                    AssetId = reader.GetInt32(reader.GetOrdinal("AssetId")),
                    EmployeeId = reader.GetInt32(reader.GetOrdinal("EmployeeId")),
                    AssignedDate = reader.GetDateTime(reader.GetOrdinal("AssignedDate")),
                    ReturnedDate = reader.IsDBNull(reader.GetOrdinal("ReturnedDate")) ? null : reader.GetDateTime(reader.GetOrdinal("ReturnedDate")),
                    ConditionOnReturn = reader.IsDBNull(reader.GetOrdinal("ConditionOnReturn")) ? null : reader.GetString(reader.GetOrdinal("ConditionOnReturn"))
                });
            }
            return results;
        }

        public async Task AssignAsync(int assetId, int employeeId)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_AssignAsset", conn) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@AssetId", assetId);
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);
            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task ReturnAsync(int assetId, string conditionOnReturn)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_ReturnAsset", conn) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@AssetId", assetId);
            cmd.Parameters.AddWithValue("@ConditionOnReturn", conditionOnReturn);
            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }
    }
}
