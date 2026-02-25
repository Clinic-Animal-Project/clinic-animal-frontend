import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Client } from '../model/client-model';


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  mensaje?: string;
}

export interface PageData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data?: PageData<T>;
  mensaje?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clientes`;

listarClientes(): Observable<Client[]> {
  return this.http.get<any>(this.apiUrl).pipe(
    map(resp => {
      console.log("RESP COMPLETO 👉", resp);
      return resp.data ?? [];
    })
  );
}
buscarClientes(id: number): Observable<Client | null> {
  return this.http.get<ApiResponse<Client>>(`${this.apiUrl}/${id}`)
    .pipe(
      map(resp => resp.data ?? null)
    );
}
}