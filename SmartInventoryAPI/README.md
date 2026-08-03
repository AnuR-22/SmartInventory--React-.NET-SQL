# Smart Inventory Management API — .NET Core Web API

Layered architecture: **Controller → Service → Repository**, with AutoMapper
for DTO mapping and raw ADO.NET (`Microsoft.Data.SqlClient`) for data access —
no Entity Framework Core, no `DbContext`.

---

## Architecture

```
Controllers/          → HTTP endpoints. Thin — validate input, call a service, return a result.
Services/Interfaces/  → Business-logic contracts.
Services/Implementations/
                       → Business rules, AutoMapper calls, orchestration.
Repositories/Interfaces/
                       → Data-access contracts.
Repositories/Implementations/
                       → Raw ADO.NET (SqlConnection/SqlCommand) against SQL Server,
                         including calls to stored procedures.
Models/                → Plain classes mapped 1:1 to database tables.
Dtos/                  → Request/response shapes exposed by the API.
Mappings/               → AutoMapper profile (Model ↔ Dto).
Common/SqlAliases.cs   → Global usings that pin SqlConnection/SqlCommand/etc.
                         to Microsoft.Data.SqlClient, preventing the
                         "ambiguous reference" error if another package
                         ever pulls in System.Data.SqlClient.
Database/              → SQL scripts: schema, sample data, stored procedures.
```

Request flow example (assigning an asset):

```
POST /api/assignments/assign
  → AssignmentsController.Assign()
    → IAssignmentService.AssignAsync()
      → IAssignmentRepository.AssignAsync()
        → SqlCommand("sp_AssignAsset", ...)
```

---

## Prerequisites

| Requirement | Version | Verify with |
|---|---|---|
| .NET SDK | 8.0+ | `dotnet --version` |
| SQL Server | 2019+ (Express is fine) | — |
| SQL Server Management Studio | Latest | — |
| Postman or the built-in Swagger UI | Any | — |

---

## Step 1 — Extract the project

```
SmartInventoryAPI/
├── Common/SqlAliases.cs
├── Controllers/
├── Database/
├── Dtos/
├── Mappings/
├── Models/
├── Repositories/
│   ├── Interfaces/
│   └── Implementations/
├── Services/
│   ├── Interfaces/
│   └── Implementations/
├── Properties/launchSettings.json
├── Program.cs
├── appsettings.json
├── appsettings.Development.json
└── SmartInventoryAPI.csproj
```

## Step 2 — Create the database

In SQL Server Management Studio, run the scripts in `/Database` **in order**:

1. `01_CreateSchema.sql`
2. `02_SampleData.sql`
3. `03_StoredProcedures.sql`

Verify:

```sql
USE SmartInventoryDB;
SELECT * FROM Assets;
```

## Step 3 — Configure the connection string

Edit `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=SmartInventoryDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

## Step 4 — Restore dependencies

```bash
cd SmartInventoryAPI
dotnet restore
```

Installs: `Microsoft.Data.SqlClient`, `QRCoder`, `ClosedXML`, `AutoMapper`, `Swashbuckle.AspNetCore`.

## Step 5 — Build

```bash
dotnet build
```

Confirm **0 Errors**.

## Step 6 — Run

```bash
dotnet run
```

## Step 7 — Verify with Swagger

Open `https://localhost:5001/swagger`. Every endpoint is grouped by
controller: Assets, Vendors, Employees, Assignments, Repairs, Dashboard,
Reports.

## Step 8 — Test with Postman (suggested order)

1. `GET /api/assets`
2. `POST /api/assignments/assign`
3. `GET /api/assets/{id}` — confirm status is now `Assigned`
4. `POST /api/assignments/return`
5. `POST /api/repairs/send`
6. `PUT /api/repairs/{id}/complete`
7. `GET /api/dashboard/summary`
8. `GET /api/reports/export-excel`

---

## Why no DbContext?

This build intentionally uses raw ADO.NET in the repository layer instead of
Entity Framework Core. Each repository opens its own `SqlConnection`, builds
parameterized `SqlCommand`s, and maps `SqlDataReader` rows to model objects by
hand. Business logic and AutoMapper conversions live one layer up, in
`Services/`, keeping controllers thin and repositories focused purely on SQL.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| `'SqlConnection' is ambiguous` | Both `Microsoft.Data.SqlClient` and legacy `System.Data.SqlClient` referenced | Run `dotnet remove package System.Data.SqlClient`, keep only `Microsoft.Data.SqlClient` — `Common/SqlAliases.cs` also guards against this |
| `The type or namespace 'QRCoder'/'XLWorkbook' could not be found` | Packages not restored | Run `dotnet restore` again; confirm `SmartInventoryAPI.csproj` lists them |
| `Cannot open database "SmartInventoryDB"` | Scripts not run, or wrong server name | Re-run Step 2; check the connection string |
| Swagger page blank | App not running / wrong port | Use the exact URL from the console's "Now listening on…" line |

## Notes

- Backend-only — no frontend included.
- CORS is fully open for local development; restrict `AllowAnyOrigin()` before deploying.
- Sample passwords in `02_SampleData.sql` are placeholders, not real hashes.
# Smart-Inventory-.NET
