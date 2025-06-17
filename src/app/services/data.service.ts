import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, switchMap } from 'rxjs';
import { TableData } from '../interfaces/table-data.interface';

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private salesEndpoint = 'https://agricover-dashboard-be-production.up.railway.app/sales';
  private purchasesEndpoint = 'https://agricover-dashboard-be-production.up.railway.app/purchases';

  pollSales(): Observable<TableData[]> {
    return timer(0, 10000).pipe(
      switchMap(() => this.http.get<TableData[]>(this.salesEndpoint))
    );
  }
  pollPurchases(): Observable<TableData[]> {
    return timer(0, 10000).pipe(
      switchMap(() => this.http.get<TableData[]>(this.purchasesEndpoint))
    );
  }
}
