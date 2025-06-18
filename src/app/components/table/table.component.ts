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

  openRowDetails(data: TableData) {
    this.onRowClicked.emit(data);
  }
}
