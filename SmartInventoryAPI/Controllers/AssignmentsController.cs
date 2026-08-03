using Microsoft.AspNetCore.Mvc;
using SmartInventoryAPI.Dtos;
using SmartInventoryAPI.Services.Interfaces;

namespace SmartInventoryAPI.Controllers
{
    [ApiController]
    [Route("api/assignments")]
    public class AssignmentsController : ControllerBase
    {
        private readonly IAssignmentService _service;

        public AssignmentsController(IAssignmentService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost("assign")]
        public async Task<IActionResult> Assign(AssignAssetDto dto)
        {
            await _service.AssignAsync(dto);
            return Ok(new { message = "Asset assigned successfully." });
        }

        [HttpPost("return")]
        public async Task<IActionResult> Return(ReturnAssetDto dto)
        {
            await _service.ReturnAsync(dto);
            return Ok(new { message = "Asset returned successfully." });
        }
    }
}
