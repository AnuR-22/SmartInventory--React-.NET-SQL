using Microsoft.AspNetCore.Mvc;
using SmartInventoryAPI.Dtos;
using SmartInventoryAPI.Services.Interfaces;

namespace SmartInventoryAPI.Controllers
{
    [ApiController]
    [Route("api/assets")]
    public class AssetsController : ControllerBase
    {
        private readonly IAssetService _service;

        public AssetsController(IAssetService service) => _service = service;

        // GET api/assets?status=Available&categoryId=1&search=dell
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] AssetFilterDto filter) =>
            Ok(await _service.GetAllAsync(filter));

        // GET api/assets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var asset = await _service.GetByIdAsync(id);
            return asset == null ? NotFound() : Ok(asset);
        }

        // POST api/assets
        [HttpPost]
        public async Task<IActionResult> Create(CreateAssetDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.AssetId }, created);
        }

        // PUT api/assets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateAssetDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }

        // DELETE api/assets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();

        // GET api/assets/5/qrcode -> returns PNG image bytes
        [HttpGet("{id}/qrcode")]
        public async Task<IActionResult> GetQrCode(int id)
        {
            var bytes = await _service.GenerateQrCodeAsync(id);
            return bytes == null ? NotFound() : File(bytes, "image/png");
        }

        // GET api/assets/scan/AST-0001
        // This is what a scanned QR code should resolve to: everything worth
        // showing on screen in one response — asset info, category, vendor,
        // current holder (if assigned), and most recent repair (if any).
        [HttpGet("scan/{assetTag}")]
        public async Task<IActionResult> ScanByTag(string assetTag)
        {
            var detail = await _service.GetDetailByTagAsync(assetTag);
            return detail == null ? NotFound(new { message = $"No asset found with tag '{assetTag}'." }) : Ok(detail);
        }
    }
}
