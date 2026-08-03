using SmartInventoryAPI.Dtos;
using SmartInventoryAPI.Models;
using SmartInventoryAPI.Repositories.Interfaces;

namespace SmartInventoryAPI.Repositories.Implementations
{
    public class AssetRepository : IAssetRepository
    {
        private readonly string _connectionString;

        public AssetRepository(IConfiguration config) =>
            _connectionString = config.GetConnectionString("DefaultConnection")!;

        private static Asset Map(SqlDataReader r) => new Asset
        {
            AssetId = r.GetInt32(r.GetOrdinal("AssetId")),
            AssetTag = r.GetString(r.GetOrdinal("AssetTag")),
            AssetName = r.GetString(r.GetOrdinal("AssetName")),
            CategoryId = r.GetInt32(r.GetOrdinal("CategoryId")),
            SerialNumber = r.IsDBNull(r.GetOrdinal("SerialNumber")) ? null : r.GetString(r.GetOrdinal("SerialNumber")),
            VendorId = r.IsDBNull(r.GetOrdinal("VendorId")) ? null : r.GetInt32(r.GetOrdinal("VendorId")),
            PurchaseDate = r.GetDateTime(r.GetOrdinal("PurchaseDate")),
            PurchaseCost = r.GetDecimal(r.GetOrdinal("PurchaseCost")),
            WarrantyEndDate = r.IsDBNull(r.GetOrdinal("WarrantyEndDate")) ? null : r.GetDateTime(r.GetOrdinal("WarrantyEndDate")),
            Status = r.GetString(r.GetOrdinal("Status")),
            QrCodeData = r.IsDBNull(r.GetOrdinal("QrCodeData")) ? null : r.GetString(r.GetOrdinal("QrCodeData")),
            CreatedAt = r.GetDateTime(r.GetOrdinal("CreatedAt"))
        };

        public async Task<List<Asset>> GetAllAsync(AssetFilterDto filter)
        {
            var assets = new List<Asset>();
            var sql = "SELECT * FROM Assets WHERE 1=1";
            if (!string.IsNullOrEmpty(filter.Status)) sql += " AND Status = @Status";
            if (filter.CategoryId.HasValue) sql += " AND CategoryId = @CategoryId";
            if (!string.IsNullOrEmpty(filter.Search)) sql += " AND (AssetName LIKE @Search OR AssetTag LIKE @Search)";

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(sql, conn);
            if (!string.IsNullOrEmpty(filter.Status)) cmd.Parameters.AddWithValue("@Status", filter.Status);
            if (filter.CategoryId.HasValue) cmd.Parameters.AddWithValue("@CategoryId", filter.CategoryId.Value);
            if (!string.IsNullOrEmpty(filter.Search)) cmd.Parameters.AddWithValue("@Search", $"%{filter.Search}%");

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync()) assets.Add(Map(reader));
            return assets;
        }

        public async Task<Asset?> GetByIdAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SELECT * FROM Assets WHERE AssetId = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            return await reader.ReadAsync() ? Map(reader) : null;
        }

        public async Task<int> CreateAsync(Asset asset)
        {
            const string sql = @"
                INSERT INTO Assets (AssetTag, AssetName, CategoryId, SerialNumber, VendorId, PurchaseDate, PurchaseCost, WarrantyEndDate, Status, QrCodeData)
                OUTPUT INSERTED.AssetId
                VALUES (@AssetTag, @AssetName, @CategoryId, @SerialNumber, @VendorId, @PurchaseDate, @PurchaseCost, @WarrantyEndDate, @Status, @QrCodeData)";

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@AssetTag", asset.AssetTag);
            cmd.Parameters.AddWithValue("@AssetName", asset.AssetName);
            cmd.Parameters.AddWithValue("@CategoryId", asset.CategoryId);
            cmd.Parameters.AddWithValue("@SerialNumber", asset.SerialNumber ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@VendorId", asset.VendorId ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@PurchaseDate", asset.PurchaseDate);
            cmd.Parameters.AddWithValue("@PurchaseCost", asset.PurchaseCost);
            cmd.Parameters.AddWithValue("@WarrantyEndDate", asset.WarrantyEndDate ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Status", asset.Status);
            cmd.Parameters.AddWithValue("@QrCodeData", asset.QrCodeData ?? (object)DBNull.Value);

            await conn.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<bool> UpdateAsync(int id, Asset asset)
        {
            const string sql = @"
                UPDATE Assets SET
                    AssetName = @AssetName,
                    CategoryId = @CategoryId,
                    SerialNumber = @SerialNumber,
                    VendorId = @VendorId,
                    PurchaseDate = @PurchaseDate,
                    PurchaseCost = @PurchaseCost,
                    WarrantyEndDate = @WarrantyEndDate
                WHERE AssetId = @Id";

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@AssetName", asset.AssetName);
            cmd.Parameters.AddWithValue("@CategoryId", asset.CategoryId);
            cmd.Parameters.AddWithValue("@SerialNumber", asset.SerialNumber ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@VendorId", asset.VendorId ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@PurchaseDate", asset.PurchaseDate);
            cmd.Parameters.AddWithValue("@PurchaseCost", asset.PurchaseCost);
            cmd.Parameters.AddWithValue("@WarrantyEndDate", asset.WarrantyEndDate ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();
            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("DELETE FROM Assets WHERE AssetId = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();
            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<string?> GetAssetTagAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SELECT AssetTag FROM Assets WHERE AssetId = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();
            return result as string;
        }

        // Everything worth showing after a scan: asset + category + vendor +
        // current holder (if assigned) + most recent repair (if any) — one query.
        public async Task<AssetDetailDto?> GetDetailByTagAsync(string assetTag)
        {
            const string sql = @"
                SELECT
                    a.AssetId, a.AssetTag, a.AssetName, a.SerialNumber, a.Status,
                    a.PurchaseDate, a.PurchaseCost, a.WarrantyEndDate,
                    c.CategoryName,
                    v.VendorName, v.Phone AS VendorPhone,
                    e.FullName AS CurrentHolderName,
                    asg.AssignedDate,
                    r.IssueDescription AS LastRepairIssue,
                    r.Status AS LastRepairStatus,
                    r.SentDate AS LastRepairDate
                FROM Assets a
                LEFT JOIN Categories c ON a.CategoryId = c.CategoryId
                LEFT JOIN Vendors v ON a.VendorId = v.VendorId
                LEFT JOIN Assignments asg ON asg.AssetId = a.AssetId AND asg.ReturnedDate IS NULL
                LEFT JOIN Employees e ON asg.EmployeeId = e.EmployeeId
                LEFT JOIN Repairs r ON r.RepairId = (
                    SELECT TOP 1 RepairId FROM Repairs
                    WHERE AssetId = a.AssetId
                    ORDER BY SentDate DESC
                )
                WHERE a.AssetTag = @AssetTag";

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@AssetTag", assetTag);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (!await reader.ReadAsync()) return null;

            var warrantyEndDate = reader.IsDBNull(reader.GetOrdinal("WarrantyEndDate"))
                ? (DateTime?)null
                : reader.GetDateTime(reader.GetOrdinal("WarrantyEndDate"));

            return new AssetDetailDto
            {
                AssetId = reader.GetInt32(reader.GetOrdinal("AssetId")),
                AssetTag = reader.GetString(reader.GetOrdinal("AssetTag")),
                AssetName = reader.GetString(reader.GetOrdinal("AssetName")),
                SerialNumber = reader.IsDBNull(reader.GetOrdinal("SerialNumber")) ? null : reader.GetString(reader.GetOrdinal("SerialNumber")),
                Status = reader.GetString(reader.GetOrdinal("Status")),
                CategoryName = reader.IsDBNull(reader.GetOrdinal("CategoryName")) ? "Uncategorized" : reader.GetString(reader.GetOrdinal("CategoryName")),
                VendorName = reader.IsDBNull(reader.GetOrdinal("VendorName")) ? null : reader.GetString(reader.GetOrdinal("VendorName")),
                VendorPhone = reader.IsDBNull(reader.GetOrdinal("VendorPhone")) ? null : reader.GetString(reader.GetOrdinal("VendorPhone")),
                PurchaseDate = reader.GetDateTime(reader.GetOrdinal("PurchaseDate")),
                PurchaseCost = reader.GetDecimal(reader.GetOrdinal("PurchaseCost")),
                WarrantyEndDate = warrantyEndDate,
                WarrantyExpired = warrantyEndDate.HasValue && warrantyEndDate.Value < DateTime.UtcNow,
                CurrentHolderName = reader.IsDBNull(reader.GetOrdinal("CurrentHolderName")) ? null : reader.GetString(reader.GetOrdinal("CurrentHolderName")),
                AssignedDate = reader.IsDBNull(reader.GetOrdinal("AssignedDate")) ? null : reader.GetDateTime(reader.GetOrdinal("AssignedDate")),
                LastRepairIssue = reader.IsDBNull(reader.GetOrdinal("LastRepairIssue")) ? null : reader.GetString(reader.GetOrdinal("LastRepairIssue")),
                LastRepairStatus = reader.IsDBNull(reader.GetOrdinal("LastRepairStatus")) ? null : reader.GetString(reader.GetOrdinal("LastRepairStatus")),
                LastRepairDate = reader.IsDBNull(reader.GetOrdinal("LastRepairDate")) ? null : reader.GetDateTime(reader.GetOrdinal("LastRepairDate"))
            };
        }
    }
}
