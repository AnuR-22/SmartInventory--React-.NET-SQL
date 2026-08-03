namespace SmartInventoryAPI.Dtos
{
    public class DashboardSummaryDto
    {
        public int TotalAssets { get; set; }
        public int AvailableAssets { get; set; }
        public int AssignedAssets { get; set; }
        public int InRepairAssets { get; set; }
        public int RetiredAssets { get; set; }
        public int WarrantyExpiringSoon { get; set; }
    }
}
