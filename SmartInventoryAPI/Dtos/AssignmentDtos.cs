namespace SmartInventoryAPI.Dtos
{
    public class AssignmentDto
    {
        public int AssignmentId { get; set; }
        public int AssetId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime AssignedDate { get; set; }
        public DateTime? ReturnedDate { get; set; }
        public string? ConditionOnReturn { get; set; }
    }

    public class AssignAssetDto
    {
        public int AssetId { get; set; }
        public int EmployeeId { get; set; }
    }

    public class ReturnAssetDto
    {
        public int AssetId { get; set; }
        public string ConditionOnReturn { get; set; } = string.Empty;
    }
}
