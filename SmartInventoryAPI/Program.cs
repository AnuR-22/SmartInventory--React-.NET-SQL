using SmartInventoryAPI.Mappings;
using SmartInventoryAPI.Repositories.Implementations;
using SmartInventoryAPI.Repositories.Interfaces;
using SmartInventoryAPI.Services.Implementations;
using SmartInventoryAPI.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ---- Explicit URLs ----
// Pinned here so the app binds to the same address every time, no matter
// how it's launched (dotnet run, the built .exe, Visual Studio, IIS Express).
builder.WebHost.UseUrls("http://localhost:5143", "https://localhost:7143");

// ---- AutoMapper ----
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// ---- Repositories (data access layer — raw ADO.NET, no DbContext) ----
builder.Services.AddScoped<IAssetRepository, AssetRepository>();
builder.Services.AddScoped<IVendorRepository, VendorRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IAssignmentRepository, AssignmentRepository>();
builder.Services.AddScoped<IRepairRepository, RepairRepository>();
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();

// ---- Services (business logic layer) ----
builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<IVendorService, VendorService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IAssignmentService, AssignmentService>();
builder.Services.AddScoped<IRepairService, RepairService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IReportService, ReportService>();

// ---- MVC / Controllers ----
builder.Services.AddControllers();

// ---- Swagger ----
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Smart Inventory Management API",
        Version = "v1",
        Description = "Asset, assignment, repair, vendor, employee, dashboard and reporting endpoints."
    });
});

// ---- CORS (open for local development; restrict before production) ----
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();

// ---- Middleware pipeline ----
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Smart Inventory Management API v1");
    options.RoutePrefix = "swagger";
});

app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();