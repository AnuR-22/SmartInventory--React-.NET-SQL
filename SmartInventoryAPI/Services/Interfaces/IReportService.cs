namespace SmartInventoryAPI.Services.Interfaces
{
    public interface IReportService
    {
        Task<byte[]> ExportAssetsToExcelAsync();
    }
}
