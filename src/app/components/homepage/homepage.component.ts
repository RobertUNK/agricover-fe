import { Component, signal, inject, OnInit } from '@angular/core';
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
export class HomepageComponent implements OnInit {
  private dataService = inject(DataService);

  salesData = signal<TableData[]>([]);
  purchasesData = signal<TableData[]>([]);

  salesTitle = 'Vânzări';
  purchasesTitle = 'Achiziții';
  selectedTableRow: TableData | null = null;

  currentSortKey: keyof TableData = 'totalBlockage';
  currentSortDirection: 'asc' | 'desc' = 'desc';

  constructor() {}

  ngOnInit() {
    this.dataService.pollOrders().subscribe(({ sales, purchases }) => {
      this.salesData.set(this.sortData(sales));
      this.purchasesData.set(this.sortData(purchases));
    });
  }

  onTableRowClicked(data: TableData) {
    this.selectedTableRow = data;
  }

  onCloseSidebar(_: boolean) {
    this.selectedTableRow = null;
  }

  onSort(sortKey: keyof TableData, direction: 'asc' | 'desc' = 'desc') {
    this.currentSortKey = sortKey;
    this.currentSortDirection = direction;

    this.salesData.set(this.sortData(this.salesData()));
    this.purchasesData.set(this.sortData(this.purchasesData()));
  }

  onSortKey(key: string) {
    const typedKey = key as keyof TableData;
    const direction =
      this.currentSortKey === typedKey && this.currentSortDirection === 'desc'
        ? 'asc'
        : 'desc';

    this.onSort(typedKey, direction);
  }

  private sortData(data: TableData[]): TableData[] {
    const sortKey = this.currentSortKey;
    const direction = this.currentSortDirection;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      const aNum = Number(aVal ?? 0);
      const bNum = Number(bVal ?? 0);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      const aStr = String(aVal ?? '').toLowerCase();
      const bStr = String(bVal ?? '').toLowerCase();
      return direction === 'desc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }
}
