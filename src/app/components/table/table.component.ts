import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableData } from '../../interfaces/table-data.interface';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() title: string = '';
  @Input() data: TableData[] = [];
  @Output() onRowClicked = new EventEmitter<TableData>();

  getStatusClass(status: string): string {
    return (
      {
        Blocat: 'badge-red',
        Atentie: 'badge-orange',
      }[status] || ''
    );
  }

  getBadgeColor(minute: string): string {
    const time = parseInt(minute);
    if (time >= 60) return 'badge-red';
    if (time >= 30) return 'badge-orange';
    return '';
  }

  addButtonClicked(data: TableData) {
    console.log(data);
  }
  openRowDetails(data: TableData) {
    this.onRowClicked.emit(data);
  }
}
