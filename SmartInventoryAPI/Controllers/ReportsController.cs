using Microsoft.AspNetCore.Mvc;
using SmartInventoryAPI.Services.Interfaces;

namespace SmartInventoryAPI.Controllers
{
    [ApiController]
    [Route("api/reports")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _service;

        public ReportsController(IReportService service) => _service = service;

        [HttpGet("export-excel")]
        public async Task<IActionResult> ExportExcel()
        {
            var bytes = await _service.ExportAssetsToExcelAsync();
            return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "AssetReport.xlsx");
        }
    }
}
