import { Component, HostBinding, Input } from '@angular/core';
import { TableData } from '../../interfaces/table-data.interface';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [NgClass, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private _tableRowData: TableData | null = null;

  @Input() set tableRowData(data: TableData | null) {
    this._tableRowData = data;
    this.isOpen = !!data;
  }

  get tableRowData(): TableData | null {
    return this._tableRowData;
  }

  @HostBinding('class.open') isOpen = false;

  closeSidebar() {
    this.isOpen = false;
  }
}
