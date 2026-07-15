import { Component, inject } from '@angular/core';
import { ApparelStoreService } from '../../data/apparel-store.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ReportService } from '../../data/report.service';

@Component({
  selector: 'app-detailed-report',
  imports: [CurrencyPipe, ReactiveFormsModule, DatePipe],
  templateUrl: './detailed-report.html',
  styleUrl: './detailed-report.scss',
})
export class DetailedReport {
  store = inject(ApparelStoreService);
  reportService = inject(ReportService);
  formBuilder = new FormBuilder();

  filterForm = this.formBuilder.group({
    start: [''],
    end: [''],
  });
  filterSalesReport() {
    const { start, end } = this.filterForm.value;
    // improve code by using signals
    this.store.setReportDates(start as string, end as string);
    this.store.getDetailedReportData(start as string, end as string);
  }
  exportReport() {
    const data = this.store.detailedReportData().data;
    this.reportService.exportToCSV(data, 'sales-report.csv');
  }
  ngOnInit() {
    this.store.getInitialReportData();
  }
  reduceTotal(option: 'revenue' | 'totalCost' | 'margin') {
    switch (option) {
      case 'revenue':
        return this.store.detailedReportData().data.reduce((sum, sale) => sum + sale.revenue, 0);
      case 'totalCost':
        return this.store.detailedReportData().data.reduce((sum, sale) => sum + sale.totalCost, 0);
      case 'margin':
        return this.store.detailedReportData().data.reduce((sum, sale) => sum + sale.margin, 0);
    }
  }
}
