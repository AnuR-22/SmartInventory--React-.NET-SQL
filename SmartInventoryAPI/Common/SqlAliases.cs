// Common/SqlAliases.cs
// Pins every SqlClient type to Microsoft.Data.SqlClient explicitly. This prevents
// the "ambiguous reference" compiler error that occurs if the legacy
// System.Data.SqlClient namespace is ever pulled in by another package.
global using SqlConnection = Microsoft.Data.SqlClient.SqlConnection;
global using SqlCommand = Microsoft.Data.SqlClient.SqlCommand;
global using SqlDataReader = Microsoft.Data.SqlClient.SqlDataReader;
global using SqlParameter = Microsoft.Data.SqlClient.SqlParameter;
global using SqlException = Microsoft.Data.SqlClient.SqlException;
