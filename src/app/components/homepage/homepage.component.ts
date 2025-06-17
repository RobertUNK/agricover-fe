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
          this.onSort('orderNumber', 'desc');
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
          this.lastPurchasesIds = new Set(data.map((i) => i.orderNumber));
          this.isFirstPurchasesLoad = false;
          this.onSort('orderNumber', 'desc');
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

  onSort(sortKey: keyof TableData, direction: 'asc' | 'desc' = 'asc') {
    const compare = (a: TableData, b: TableData): number => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      // Special case: sortare numerică pentru orderNumber
      if (sortKey === 'orderNumber') {
        const aNum = Number(aVal);
        const bNum = Number(bVal);
        return direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return direction === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    };

    this.salesData.set([...this.salesData()].sort(compare));
    this.purchasesData.set([...this.purchasesData()].sort(compare));
  }

  onSortKey(key: string) {
    const direction = key === 'orderNumber' ? 'desc' : 'asc';
    this.onSort(key as keyof TableData, direction);
  }
}
