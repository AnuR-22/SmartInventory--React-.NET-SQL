namespace SmartInventoryAPI.Models
{
    public class Assignment
    {
        public int AssignmentId { get; set; }
        public int AssetId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ReturnedDate { get; set; }
        public string? ConditionOnReturn { get; set; }
    }
}
