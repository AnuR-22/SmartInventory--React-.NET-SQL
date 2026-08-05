using AutoMapper;
using QRCoder;
using SmartInventoryAPI.Dtos;
using SmartInventoryAPI.Models;
using SmartInventoryAPI.Repositories.Interfaces;
using SmartInventoryAPI.Services.Interfaces;

namespace SmartInventoryAPI.Services.Implementations
{
    public class AssetService : IAssetService
    {
        private readonly IAssetRepository _repository;
        private readonly IMapper _mapper;
        private readonly string _baseUrl;

        public AssetService(IAssetRepository repository, IMapper mapper, IConfiguration config)
        {
            _repository = repository;
            _mapper = mapper;
            _baseUrl = config["AppSettings:BaseUrl"] ?? "https://smartinventory-react-net-sql-1.onrender.com";
        }

        public async Task<List<AssetDto>> GetAllAsync(AssetFilterDto filter)
        {
            var assets = await _repository.GetAllAsync(filter);
            return _mapper.Map<List<AssetDto>>(assets);
        }

        public async Task<AssetDto?> GetByIdAsync(int id)
        {
            var asset = await _repository.GetByIdAsync(id);
            return asset == null ? null : _mapper.Map<AssetDto>(asset);
        }

        public async Task<AssetDto> CreateAsync(CreateAssetDto dto)
        {
            var asset = _mapper.Map<Asset>(dto);
            asset.Status = "Available";
            asset.QrCodeData = asset.AssetTag; // business rule: QR payload = asset tag

            var newId = await _repository.CreateAsync(asset);
            asset.AssetId = newId;
            return _mapper.Map<AssetDto>(asset);
        }

        public async Task<AssetDto?> UpdateAsync(int id, UpdateAssetDto dto)
        {
            var asset = _mapper.Map<Asset>(dto);
            var updated = await _repository.UpdateAsync(id, asset);
            return updated ? await GetByIdAsync(id) : null;
        }

        public Task<bool> DeleteAsync(int id) => _repository.DeleteAsync(id);

        public async Task<byte[]?> GenerateQrCodeAsync(int id)
        {
            var assetTag = await _repository.GetAssetTagAsync(id);
            if (assetTag == null) return null;

            // Encode a full URL, not just the bare tag — so scanning the sticker
            // with a phone camera opens the browser directly on the asset's
            // full details (category, vendor, current holder, repair history)
            // instead of just showing plain text like "AST-0001".
            var scanUrl = $"{_baseUrl}/api/assets/scan/{Uri.EscapeDataString(assetTag)}";

            using var generator = new QRCodeGenerator();
            var qrData = generator.CreateQrCode(scanUrl, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new PngByteQRCode(qrData);
            return qrCode.GetGraphic(20);
        }

        public Task<AssetDetailDto?> GetDetailByTagAsync(string assetTag) =>
            _repository.GetDetailByTagAsync(assetTag);
    }
}
