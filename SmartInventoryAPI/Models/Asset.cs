namespace SmartInventoryAPI.Models
{
    public class Asset
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
        public string Status { get; set; } = "Available";
        public string? QrCodeData { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
