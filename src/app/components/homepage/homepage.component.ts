import { Component, signal, effect, inject } from '@angular/core';
import { TableData } from '../../interfaces/table-data.interface';
import { TableComponent } from '../table/table.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [TableComponent, HeaderComponent, SidebarComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  private isFirstSalesLoad = true;
  private isFirstPurchasesLoad = true;
  private dataService = inject(DataService);
  private lastSalesIds = new Set<string>();
  private lastPurchasesIds = new Set<string>();
  salesData = signal<TableData[]>([]);
  purchasesData = signal<TableData[]>([]);

  salesTitle = 'Vanzari';
  purchasesTitle = 'Achizitii';
  selectedTableRow: TableData | null = null;

  constructor() {
    effect(() => {
      this.dataService.pollSales().subscribe((data) => {
        const current = this.salesData();
        const newItems = data.filter(
          (item) => !this.lastSalesIds.has(item.orderNumber)
        );

        if (this.isFirstSalesLoad) {
          this.salesData.set(data);
          this.lastSalesIds = new Set(data.map((i) => i.orderNumber));
          this.isFirstSalesLoad = false;
          return;
        }

        if (newItems.length) {
          this.playBeep();
          const highlighted = newItems.map((item) => ({
            ...item,
            highlight: true,
          }));
          this.salesData.set([...highlighted, ...current]);

          setTimeout(() => {
            const updated = this.salesData().map((item) => ({
              ...item,
              highlight: false,
            }));
            this.salesData.set(updated);
          }, 3500);
        }

        this.lastSalesIds = new Set(data.map((i) => i.orderNumber));
      });
    });

    effect(() => {
      this.dataService.pollPurchases().subscribe((data) => {
        const current = this.purchasesData();
        const newItems = data.filter(
          (item) => !this.lastPurchasesIds.has(item.orderNumber)
        );

        if (this.isFirstPurchasesLoad) {
          this.purchasesData.set(data);
          this.lastPurchasesIds = new Set(data.map((i) => i.orderNumber)); // 🔧 aici era problema
          this.isFirstPurchasesLoad = false;
          return;
        }

        if (newItems.length) {
          this.playBeep();
          const highlighted = newItems.map((item) => ({
            ...item,
            highlight: true,
          }));
          this.purchasesData.set([...highlighted, ...current]);

          setTimeout(() => {
            const updated = this.purchasesData().map((item) => ({
              ...item,
              highlight: false,
            }));
            this.purchasesData.set(updated);
          }, 3500);
        }

        this.lastPurchasesIds = new Set(data.map((i) => i.orderNumber));
      });
    });
  }

  playBeep() {
    const audio = new Audio('/assets/sounds/notification.mp3');
    audio.play();
  }

  onTableRowClicked(data: TableData) {
    this.selectedTableRow = data;
  }

  onCloseSidebar(boolean: boolean) {
    this.selectedTableRow = null;
  }

  onSort(sortKey: keyof TableData) {
    const safeString = (value: unknown): string => {
      if (Array.isArray(value)) return JSON.stringify(value);
      if (typeof value === 'boolean') return value ? 'true' : 'false';
      if (typeof value === 'string') return value;
      return value?.toString() ?? '';
    };

    const sortedSales = [...this.salesData()].sort((a, b) =>
      safeString(a[sortKey]).localeCompare(safeString(b[sortKey]))
    );
    this.salesData.set(sortedSales);

    const sortedPurchases = [...this.purchasesData()].sort((a, b) =>
      safeString(a[sortKey]).localeCompare(safeString(b[sortKey]))
    );
    this.purchasesData.set(sortedPurchases);
  }

  onSortKey(key: string) {
    this.onSort(key as keyof TableData);
  }
}
