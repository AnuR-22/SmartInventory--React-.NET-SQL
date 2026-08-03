namespace SmartInventoryAPI.Dtos
{
    public class VendorDto
    {
        public int VendorId { get; set; }
        public string VendorName { get; set; } = string.Empty;
        public string? ContactName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
    }

    public class CreateVendorDto
    {
        public string VendorName { get; set; } = string.Empty;
        public string? ContactName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
    }

    public class UpdateVendorDto : CreateVendorDto { }
}
