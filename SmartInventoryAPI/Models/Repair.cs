namespace SmartInventoryAPI.Models
{
    public class Repair
    {
        public int RepairId { get; set; }
        public int AssetId { get; set; }
        public int? VendorId { get; set; }
        public string IssueDescription { get; set; } = string.Empty;
        public DateTime SentDate { get; set; } = DateTime.UtcNow;
        public DateTime? ReturnedDate { get; set; }
        public decimal? Cost { get; set; }
        public string Status { get; set; } = "In Progress";
    }
}
