import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  exportToCSV(data: any[], filename: string = 'sales-report.csv') {
    if (!data || !data.length) {
      return;
    }

    // Define headers
    const headers = ['Item', 'Units', 'Cost', 'Price', 'Revenue', 'Total Cost', 'Margin(Profit)'];

    // Map rows
    const rows = data.map((sale) => [
      sale.item,
      sale.units,
      sale.cost,
      sale.price,
      sale.revenue,
      sale.totalCost,
      sale.margin,
    ]);

    // Build CSV string
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
