using AutoMapper;
using SmartInventoryAPI.Dtos;
using SmartInventoryAPI.Models;

namespace SmartInventoryAPI.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Asset
            CreateMap<Asset, AssetDto>();
            CreateMap<CreateAssetDto, Asset>();
            CreateMap<UpdateAssetDto, Asset>();

            // Vendor
            CreateMap<Vendor, VendorDto>();
            CreateMap<CreateVendorDto, Vendor>();
            CreateMap<UpdateVendorDto, Vendor>();

            // Employee
            CreateMap<Employee, EmployeeDto>();
            CreateMap<CreateEmployeeDto, Employee>();

            // Assignment
            CreateMap<Assignment, AssignmentDto>();

            // Repair
            CreateMap<Repair, RepairDto>();
        }
    }
}
