import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
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
  @Output() onCloseSidebar = new EventEmitter<boolean>();

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
    this.onCloseSidebar.emit(true);
  }

  formatDate(ts?: string | number): string {
    if (!ts) return '';
    const str = ts.toString();
    if (str.length !== 14) return '';
    return `${str.slice(6, 8)}/${str.slice(4, 6)}/${str.slice(0, 4)}`;
  }

  getMinutesSince(ts?: string | number): number {
    if (!ts) return 0;
    const str = ts.toString();
    if (str.length !== 14) return 0;

    const date = new Date(
      +str.slice(0, 4),
      +str.slice(4, 6) - 1,
      +str.slice(6, 8),
      +str.slice(8, 10),
      +str.slice(10, 12),
      +str.slice(12, 14)
    );

    return Math.floor((Date.now() - date.getTime()) / 60000);
  }

  formatDuration(ts?: string | number): string {
    if (!ts) return '-';

    const minutes = this.getMinutesSince(ts);
    if (minutes <= 0) return '-';

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'min' : 'min'}`;
    }

    if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours} ${hours === 1 ? 'oră' : 'ore'}`;
    }

    const days = Math.floor(minutes / 1440);
    return `${days} ${days === 1 ? 'zi' : 'zile'}`;
  }
}
