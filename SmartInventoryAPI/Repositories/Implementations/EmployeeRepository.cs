using SmartInventoryAPI.Models;
using SmartInventoryAPI.Repositories.Interfaces;

namespace SmartInventoryAPI.Repositories.Implementations
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly string _connectionString;

        public EmployeeRepository(IConfiguration config) =>
            _connectionString = config.GetConnectionString("DefaultConnection")!;

        private static Employee Map(SqlDataReader r) => new Employee
        {
            EmployeeId = r.GetInt32(r.GetOrdinal("EmployeeId")),
            FullName = r.GetString(r.GetOrdinal("FullName")),
            Email = r.GetString(r.GetOrdinal("Email")),
            DepartmentId = r.GetInt32(r.GetOrdinal("DepartmentId")),
            IsActive = r.GetBoolean(r.GetOrdinal("IsActive"))
        };

        public async Task<List<Employee>> GetAllAsync()
        {
            var employees = new List<Employee>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SELECT * FROM Employees", conn);
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync()) employees.Add(Map(reader));
            return employees;
        }

        public async Task<Employee?> GetByIdAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SELECT * FROM Employees WHERE EmployeeId = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            return await reader.ReadAsync() ? Map(reader) : null;
        }

        public async Task<int> CreateAsync(Employee employee)
        {
            const string sql = @"
                INSERT INTO Employees (FullName, Email, DepartmentId, IsActive)
                OUTPUT INSERTED.EmployeeId
                VALUES (@FullName, @Email, @DepartmentId, 1)";

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@FullName", employee.FullName);
            cmd.Parameters.AddWithValue("@Email", employee.Email);
            cmd.Parameters.AddWithValue("@DepartmentId", employee.DepartmentId);

            await conn.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("DELETE FROM Employees WHERE EmployeeId = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            await conn.OpenAsync();
            return await cmd.ExecuteNonQueryAsync() > 0;
        }
    }
}
