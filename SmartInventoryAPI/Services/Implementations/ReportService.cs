using ClosedXML.Excel;
using SmartInventoryAPI.Repositories.Interfaces;
using SmartInventoryAPI.Services.Interfaces;

namespace SmartInventoryAPI.Services.Implementations
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _repository;

        public ReportService(IReportRepository repository) => _repository = repository;

        public async Task<byte[]> ExportAssetsToExcelAsync()
        {
            var assets = await _repository.GetAssetsForExportAsync();

            using var workbook = new XLWorkbook();
            var sheet = workbook.Worksheets.Add("Assets");
            sheet.Cell(1, 1).Value = "Asset Tag";
            sheet.Cell(1, 2).Value = "Name";
            sheet.Cell(1, 3).Value = "Status";
            sheet.Cell(1, 4).Value = "Purchase Cost";

            int row = 2;
            foreach (var a in assets)
            {
                sheet.Cell(row, 1).Value = a.AssetTag;
                sheet.Cell(row, 2).Value = a.AssetName;
                sheet.Cell(row, 3).Value = a.Status;
                sheet.Cell(row, 4).Value = a.PurchaseCost;
                row++;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}
