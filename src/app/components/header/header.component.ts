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
  selectedOption = 'Total blocaj';
  dropdownOptions: string[] = [
    'Vânzări',
    'Nr Comandă',
    'Client',
    'Agent',
    'Data',
    'Motiv',
    'Responsabil',
    'Durată Blocare',
    'Livrare parțială',
    'Total blocaj',
  ];

  sortKeyMap: Record<string, keyof TableData> = {
    'Nr Comandă': 'orderNumber',
    Client: 'client',
    Agent: 'agent',
    Data: 'data',
    Zonă: 'zone',
    Status: 'status',
    Motiv: 'reason',
    Responsabil: 'responsive',
    'Durată blocare': 'lockDuration',
    'Livrare parțială': 'partialDelivery',
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
