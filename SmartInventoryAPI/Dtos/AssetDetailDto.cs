namespace SmartInventoryAPI.Dtos
{
    // Everything worth showing on a "scan result" screen, in one response.
    public class AssetDetailDto
    {
        public int AssetId { get; set; }
        public string AssetTag { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public string? SerialNumber { get; set; }
        public string Status { get; set; } = string.Empty;

        public string CategoryName { get; set; } = string.Empty;

        public string? VendorName { get; set; }
        public string? VendorPhone { get; set; }

        public DateTime PurchaseDate { get; set; }
        public decimal PurchaseCost { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
        public bool WarrantyExpired { get; set; }

        // Who currently has it (null if not assigned)
        public string? CurrentHolderName { get; set; }
        public DateTime? AssignedDate { get; set; }

        // Most recent repair, if any
        public string? LastRepairIssue { get; set; }
        public string? LastRepairStatus { get; set; }
        public DateTime? LastRepairDate { get; set; }
    }
}
