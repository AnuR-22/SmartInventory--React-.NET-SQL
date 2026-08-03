namespace SmartInventoryAPI.Dtos
{
    public class RepairDto
    {
        public int RepairId { get; set; }
        public int AssetId { get; set; }
        public int? VendorId { get; set; }
        public string IssueDescription { get; set; } = string.Empty;
        public DateTime SentDate { get; set; }
        public DateTime? ReturnedDate { get; set; }
        public decimal? Cost { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class SendForRepairDto
    {
        public int AssetId { get; set; }
        public int VendorId { get; set; }
        public string IssueDescription { get; set; } = string.Empty;
    }

    public class CompleteRepairDto
    {
        public decimal Cost { get; set; }
        public string Status { get; set; } = "Completed"; // Completed | Unrepairable
    }
}
