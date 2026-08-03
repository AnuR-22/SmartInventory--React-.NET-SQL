using AutoMapper;
using SmartInventoryAPI.Dtos;
using SmartInventoryAPI.Repositories.Interfaces;
using SmartInventoryAPI.Services.Interfaces;

namespace SmartInventoryAPI.Services.Implementations
{
    public class AssignmentService : IAssignmentService
    {
        private readonly IAssignmentRepository _repository;
        private readonly IMapper _mapper;

        public AssignmentService(IAssignmentRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<AssignmentDto>> GetAllAsync() =>
            _mapper.Map<List<AssignmentDto>>(await _repository.GetAllAsync());

        public Task AssignAsync(AssignAssetDto dto) => _repository.AssignAsync(dto.AssetId, dto.EmployeeId);

        public Task ReturnAsync(ReturnAssetDto dto) => _repository.ReturnAsync(dto.AssetId, dto.ConditionOnReturn);
    }
}
