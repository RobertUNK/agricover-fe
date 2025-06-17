import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableData } from '../../interfaces/table-data.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [NgClass],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() title: string = '';
  @Input() data: TableData[] = [];
  @Output() onRowClicked = new EventEmitter<TableData>();

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'blocat':
        return 'blocked';
      case 'în așteptare':
        return 'waiting';
      case 'livrat':
        return 'delivered';
      default:
        return '';
    }
  }

  getBadgeColor(minute: string): string {
    const time = parseInt(minute);
    if (time >= 60) return 'badge-red';
    if (time >= 30) return 'badge-orange';
    return '';
  }

  openRowDetails(data: TableData) {
    this.onRowClicked.emit(data);
  }
}
