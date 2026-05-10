import * as XLSX from "xlsx";

export function exportToExcel(
  filename: string,
  headers: string[],
  rows: (string | number | null | undefined)[][],
) {
  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // 컬럼 너비 자동 조정
  const colWidths = headers.map((h, i) => ({
    wch: Math.max(
      h.length * 2,
      ...rows.map((r) => String(r[i] ?? "").length * 1.5),
    ),
  }));
  ws["!cols"] = colWidths;

  XLSX.writeFile(
    wb,
    `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
}
