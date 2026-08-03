using Microsoft.AspNetCore.Mvc;
using SmartInventoryAPI.Dtos;
using SmartInventoryAPI.Services.Interfaces;

namespace SmartInventoryAPI.Controllers
{
    [ApiController]
    [Route("api/repairs")]
    public class RepairsController : ControllerBase
    {
        private readonly IRepairService _service;

        public RepairsController(IRepairService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("asset/{assetId}")]
        public async Task<IActionResult> GetByAsset(int assetId) => Ok(await _service.GetByAssetIdAsync(assetId));

        [HttpPost("send")]
        public async Task<IActionResult> Send(SendForRepairDto dto)
        {
            await _service.SendForRepairAsync(dto);
            return Ok(new { message = "Asset sent for repair successfully." });
        }

        [HttpPut("{repairId}/complete")]
        public async Task<IActionResult> Complete(int repairId, CompleteRepairDto dto)
        {
            await _service.CompleteRepairAsync(repairId, dto);
            return Ok(new { message = "Repair completed successfully." });
        }
    }
}
