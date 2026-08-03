using Microsoft.AspNetCore.Mvc;
using SmartInventoryAPI.Services.Interfaces;

namespace SmartInventoryAPI.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _service;

        public DashboardController(IDashboardService service) => _service = service;

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary() => Ok(await _service.GetSummaryAsync());
    }
}
