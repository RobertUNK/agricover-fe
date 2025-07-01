import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableData } from '../../interfaces/table-data.interface';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() title: string = '';
  @Input() data: TableData[] = [];
  @Output() onRowClicked = new EventEmitter<TableData>();

  openRowDetails(data: TableData) {
    this.onRowClicked.emit(data);
  }

  formatDate(ts: number | string): string {
    const str = ts.toString();
    if (str.length !== 14) return '';

    const day = str.slice(6, 8);
    const month = str.slice(4, 6);
    const year = str.slice(0, 4);
    return `${day}/${month}/${year}`;
  }

  getMinutesSince(ts: number | string): number {
    const str = ts.toString();
    if (str.length !== 14) return 0;

    const year = +str.slice(0, 4);
    const month = +str.slice(4, 6) - 1;
    const day = +str.slice(6, 8);
    const hour = +str.slice(8, 10);
    const minute = +str.slice(10, 12);
    const second = +str.slice(12, 14);

    const eventDate = new Date(year, month, day, hour, minute, second);
    const now = new Date();

    const diffMs = now.getTime() - eventDate.getTime();
    return Math.floor(diffMs / 60000);
  }

  displayValue(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === '') return '-';
    return value.toString();
  }

  formatDuration(ts: number | string | null | undefined): string {
    if (!ts) return '-';

    const minutes = this.getMinutesSince(ts);
    if (minutes <= 0) return '-';

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'min' : 'min'}`;
    }

    if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours} ${hours === 1 ? 'ora' : 'ore'}`;
    }

    const days = Math.floor(minutes / 1440);
    return `${days} ${days === 1 ? 'zi' : 'zile'}`;
  }
}
