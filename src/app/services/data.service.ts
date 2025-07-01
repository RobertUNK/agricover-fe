import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, switchMap, catchError, of } from 'rxjs';
import { TableData } from '../interfaces/table-data.interface';
import {
  Achizitie,
  OrdersResponse,
  PozitieAchizitie,
  PozitieVanzare,
  Vanzare,
} from '../interfaces/orders-response.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private readonly DASH_URL = `${environment.domainUrl}/DASH_GET_ORDERS?sap-client=220`;

  pollOrders() {
    return timer(0, 5000).pipe(
      switchMap(() =>
        this.http.get<OrdersResponse>(this.DASH_URL).pipe(
          catchError((err) => {
            console.error('Eroare la pollOrders:', err);
            return of({ vanzari: [], achizitii: [] });
          }),
          switchMap((response) => {
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

            const purchases: TableData[] = response.achizitii.map(
              (a: Achizitie) => ({
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
              })
            );

            return of({ sales, purchases });
          })
        )
      )
    );
  }
}
