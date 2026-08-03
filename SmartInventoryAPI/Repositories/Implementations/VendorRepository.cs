using SmartInventoryAPI.Models;
using SmartInventoryAPI.Repositories.Interfaces;

namespace SmartInventoryAPI.Repositories.Implementations
{
    public class VendorRepository : IVendorRepository
    {
        private readonly string _connectionString;

        public VendorRepository(IConfiguration config) =>
            _connectionString = config.GetConnectionString("DefaultConnection")!;

        private static Vendor Map(SqlDataReader r) => new Vendor
        {
            VendorId = r.GetInt32(r.GetOrdinal("VendorId")),
            VendorName = r.GetString(r.GetOrdinal("VendorName")),
            ContactName = r.IsDBNull(r.GetOrdinal("ContactName")) ? null : r.GetString(r.GetOrdinal("ContactName")),
            Phone = r.IsDBNull(r.GetOrdinal("Phone")) ? null : r.GetString(r.GetOrdinal("Phone")),
            Email = r.IsDBNull(r.GetOrdinal("Email")) ? null : r.GetString(r.GetOrdinal("Email")),
            Address = r.IsDBNull(r.GetOrdinal("Address")) ? null : r.GetString(r.GetOrdinal("Address"))
        };

        public async Task<List<Vendor>> GetAllAsync()
        {
            var vendors = new List<Vendor>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SELECT * FROM Vendors", conn);
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync()) vendors.Add(Map(reader));
            return vendors;
        }

        public async Task<Vendor?> GetByIdAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SELECT * FROM Vendors WHERE VendorId = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            return await reader.ReadAsync() ? Map(reader) : null;
        }

        public async Task<int> CreateAsync(Vendor vendor)
        {
            const string sql = @"
                INSERT INTO Vendors (VendorName, ContactName, Phone, Email, Address)
                OUTPUT INSERTED.VendorId
                VALUES (@VendorName, @ContactName, @Phone, @Email, @Address)";

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@VendorName", vendor.VendorName);
            cmd.Parameters.AddWithValue("@ContactName", vendor.ContactName ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Phone", vendor.Phone ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", vendor.Email ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Address", vendor.Address ?? (object)DBNull.Value);

            await conn.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<bool> UpdateAsync(int id, Vendor vendor)
        {
            const string sql = @"
                UPDATE Vendors SET
                    VendorName = @VendorName,
                    ContactName = @ContactName,
                    Phone = @Phone,
                    Email = @Email,
                    Address = @Address
                WHERE VendorId = @Id";

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@VendorName", vendor.VendorName);
            cmd.Parameters.AddWithValue("@ContactName", vendor.ContactName ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Phone", vendor.Phone ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", vendor.Email ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Address", vendor.Address ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();
            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("DELETE FROM Vendors WHERE VendorId = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();
            return await cmd.ExecuteNonQueryAsync() > 0;
        }
    }
}
