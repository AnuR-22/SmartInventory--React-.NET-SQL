using AutoMapper;
using SmartInventoryAPI.Dtos;
using SmartInventoryAPI.Models;
using SmartInventoryAPI.Repositories.Interfaces;
using SmartInventoryAPI.Services.Interfaces;

namespace SmartInventoryAPI.Services.Implementations
{
    public class VendorService : IVendorService
    {
        private readonly IVendorRepository _repository;
        private readonly IMapper _mapper;

        public VendorService(IVendorRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<VendorDto>> GetAllAsync() =>
            _mapper.Map<List<VendorDto>>(await _repository.GetAllAsync());

        public async Task<VendorDto?> GetByIdAsync(int id)
        {
            var vendor = await _repository.GetByIdAsync(id);
            return vendor == null ? null : _mapper.Map<VendorDto>(vendor);
        }

        public async Task<VendorDto> CreateAsync(CreateVendorDto dto)
        {
            var vendor = _mapper.Map<Vendor>(dto);
            vendor.VendorId = await _repository.CreateAsync(vendor);
            return _mapper.Map<VendorDto>(vendor);
        }

        public async Task<VendorDto?> UpdateAsync(int id, UpdateVendorDto dto)
        {
            var vendor = _mapper.Map<Vendor>(dto);
            var updated = await _repository.UpdateAsync(id, vendor);
            return updated ? await GetByIdAsync(id) : null;
        }

        public Task<bool> DeleteAsync(int id) => _repository.DeleteAsync(id);
    }
}
