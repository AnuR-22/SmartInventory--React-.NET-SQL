using AutoMapper;
using SmartInventoryAPI.Dtos;
using SmartInventoryAPI.Repositories.Interfaces;
using SmartInventoryAPI.Services.Interfaces;

namespace SmartInventoryAPI.Services.Implementations
{
    public class RepairService : IRepairService
    {
        private readonly IRepairRepository _repository;
        private readonly IMapper _mapper;

        public RepairService(IRepairRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<RepairDto>> GetAllAsync() =>
            _mapper.Map<List<RepairDto>>(await _repository.GetAllAsync());

        public async Task<List<RepairDto>> GetByAssetIdAsync(int assetId) =>
            _mapper.Map<List<RepairDto>>(await _repository.GetByAssetIdAsync(assetId));

        public Task SendForRepairAsync(SendForRepairDto dto) =>
            _repository.SendForRepairAsync(dto.AssetId, dto.VendorId, dto.IssueDescription);

        public Task CompleteRepairAsync(int repairId, CompleteRepairDto dto) =>
            _repository.CompleteRepairAsync(repairId, dto.Cost, dto.Status);
    }
}
