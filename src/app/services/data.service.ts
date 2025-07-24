import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  timer,
  switchMap,
  catchError,
  of,
  from,
  defer,
  map,
  EMPTY,
  Observable,
} from 'rxjs';
import { TableData } from '../interfaces/table-data.interface';
import {
  Achizitie,
  OrdersResponse,
  PozitieAchizitie,
  PozitieVanzare,
  Vanzare,
} from '../interfaces/orders-response.interface';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly DASH_URL = `${environment.domainUrl}/DASH_GET_ORDERS`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  pollOrders() {
    return defer(() => this.loginWithRetry()).pipe(
      switchMap(() =>
        timer(0, 30000).pipe(
          switchMap(() =>
            this.http.get<OrdersResponse>(this.DASH_URL).pipe(
              catchError((err) => {
                console.error('Eroare la DASH_GET_ORDERS:', err);

                if (err.status === 401 || err.status === 403) {
                  console.warn('Token invalid sau expirat. Relogin...');
                  this.authService.clearToken();

                  // Refacem loginul și restartăm polling-ul
                  return this.loginWithRetry().pipe(
                    switchMap(() => of({ vanzari: [], achizitii: [] }))
                  );
                }

                return of({ vanzari: [], achizitii: [] } as OrdersResponse);
              }),
              map((response) => this.transformResponse(response))
            )
          )
        )
      )
    );
  }

  private loginWithRetry(): Observable<boolean> {
    return defer(() => {
      if (this.authService.getToken()) {
        return of(true);
      }

      return from(this.authService.ensureAuthenticated()).pipe(
        catchError((err) => {
          console.warn('Login eșuat. Se reîncearcă în 5 secunde...', err);
          return timer(30000).pipe(switchMap(() => this.loginWithRetry()));
        }),
        switchMap(() => {
          if (this.authService.getToken()) {
            return of(true);
          }
          return timer(30000).pipe(switchMap(() => this.loginWithRetry()));
        })
      );
    });
  }

  private transformResponse(response: OrdersResponse): {
    sales: TableData[];
    purchases: TableData[];
  } {
    const sales: TableData[] = response.vanzari.map((v: Vanzare) => ({
      orderNumber: v.vbeln,
      client: v.name1,
      agent: v.agent,
      data: v.timestamp1,
      zone: v.vkburBezei,
      status: v.status,
      reason: v.motivblocaj,
      responsive: v.responsabil,
      lockDuration: v.timestamp2,
      partialDelivery: v.autlf,
      totalBlockage: v.timestamp2,
      orderDetails: (v.pozitii ?? []).map((p: PozitieVanzare) => ({
        positionNumber: p.posnr,
        materialCode: p.matnr,
        materialName: p.arktx,
        quantity: p.kwmeng,
        um: p.vrkme,
        logisticUnity: p.werks,
        stock: p.ulstock,
      })),
    }));

    const purchases: TableData[] = response.achizitii.map((a: Achizitie) => ({
      orderNumber: a.ebeln,
      client: a.name1,
      agent: '',
      data: a.timestamp1,
      zone: '',
      status: a.status,
      reason: a.motivblocaj,
      responsive: a.responsabil,
      lockDuration: a.timestamp2,
      partialDelivery: '',
      totalBlockage: a.timestamp2,
      orderDetails: (a.pozitii ?? []).map((p: PozitieAchizitie) => ({
        positionNumber: +p.ebelp,
        materialCode: p.matnr,
        materialName: p.txz01,
        quantity: p.menge,
        um: p.bprme,
        logisticUnity: p.werks,
        stock: 0,
      })),
    }));

    return { sales, purchases };
  }
}
