using Microsoft.OpenApi.Models;
using SmartInventoryAPI.Mappings;
using SmartInventoryAPI.Repositories.Implementations;
using SmartInventoryAPI.Repositories.Interfaces;
using SmartInventoryAPI.Services.Implementations;
using SmartInventoryAPI.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Render uses the PORT environment variable
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ---------------- AutoMapper ----------------
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// ---------------- Repositories ----------------
builder.Services.AddScoped<IAssetRepository, AssetRepository>();
builder.Services.AddScoped<IVendorRepository, VendorRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IAssignmentRepository, AssignmentRepository>();
builder.Services.AddScoped<IRepairRepository, RepairRepository>();
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();

// ---------------- Services ----------------
builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<IVendorService, VendorService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IAssignmentService, AssignmentService>();
builder.Services.AddScoped<IRepairService, RepairService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IReportService, ReportService>();

// ---------------- Controllers ----------------
builder.Services.AddControllers();

// ---------------- Swagger ----------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Smart Inventory Management API",
        Version = "v1",
        Description = "Asset, Assignment, Vendor, Employee, Dashboard and Reports API"
    });
});

// ---------------- CORS ----------------
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ---------------- Middleware ----------------
app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Smart Inventory API V1");
    options.RoutePrefix = "swagger";
});

// Do NOT use HTTPS redirection on Render
// app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();