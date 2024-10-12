import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (data: any[], columns: string[], title: string) => {
  const doc = new jsPDF();
  doc.text(title, 14, 15);
  doc.autoTable({
    head: [columns],
    body: data.map(item => columns.map(col => item[col])),
    startY: 20,
  });
  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
};

export const exportToExcel = (data: any[], columns: string[], title: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s+/g, '_')}.xlsx`);
};