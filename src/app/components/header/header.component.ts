import { Component, EventEmitter, Output } from '@angular/core';
import { TableData } from '../../interfaces/table-data.interface';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() onSelectSortingOption = new EventEmitter<string>();

  isDropdownOpen = false;
  selectedOption = 'Nr Comanda';
  dropdownOptions: string[] = [
    'Vanzari',
    'Nr Comanda',
    'Client',
    'Agent',
    'Data',
    'Zona',
    'Status',
    'Motiv',
    'Responsabil',
    'Durata Blocare',
    'Livrare partiala',
    'Total blocaj',
  ];
  sortKeyMap: Record<string, keyof TableData> = {
    'Nr Comanda': 'orderNumber',
    Client: 'client',
    Agent: 'agent',
    Data: 'data',
    Zona: 'zone',
    Status: 'status',
    Motiv: 'reason',
    Responsabil: 'responsive',
    'Durata blocare': 'lockDuration',
    'Livrare partiala': 'partialDelivery',
    'Total blocaj': 'totalBlockage',
  };

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
    this.onSelectSortingOption.emit(this.sortKeyMap[option]);
  }
}
