namespace SmartInventoryAPI.Dtos
{
    public class AssetDto
    {
        public int AssetId { get; set; }
        public string AssetTag { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string? SerialNumber { get; set; }
        public int? VendorId { get; set; }
        public DateTime PurchaseDate { get; set; }
        public decimal PurchaseCost { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? QrCodeData { get; set; }
    }

    public class CreateAssetDto
    {
        public string AssetTag { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string? SerialNumber { get; set; }
        public int? VendorId { get; set; }
        public DateTime PurchaseDate { get; set; }
        public decimal PurchaseCost { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
    }

    public class UpdateAssetDto
    {
        public string AssetName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string? SerialNumber { get; set; }
        public int? VendorId { get; set; }
        public DateTime PurchaseDate { get; set; }
        public decimal PurchaseCost { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
    }

    public class AssetFilterDto
    {
        public string? Status { get; set; }
        public int? CategoryId { get; set; }
        public string? Search { get; set; }
    }
}
