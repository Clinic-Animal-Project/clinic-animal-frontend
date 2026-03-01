import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Client, ClienteRequestDto } from '../model/client-model';
import { Mascota } from '../../mascotas/models/mascotas.models';


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
  private mascotasApiUrl = `${environment.apiUrl}/mascotas`;

listarClientes(nombre: string): Observable<Client[]> {
  if (nombre) {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(resp => {
        console.log("RESP COMPLETO 👉", resp);
        return resp.data ?? [];
      })
    );
  } else {
    return this.http.get<any>(this.apiUrl).pipe(
      map(resp => {
        console.log("RESP COMPLETO 👉", resp);
        return resp.data ?? [];
      })
    );
  }
}

listarMascotasPorCliente(id: number): Observable<Mascota[]> {
  return this.http.get<any>(`${this.mascotasApiUrl}/cliente/${id}`).pipe(
    map(resp => {
      console.log("Mascotas del cliente 👉", resp);
      return resp.data ?? [];
    })
  );
}
buscarClientePorId(id: number) {
  return this.http.get<any>(`${this.apiUrl}/${id}`);
}


// client-service.ts

registrarCliente(cliente: ClienteRequestDto): Observable<Client> {
  return this.http.post<any>(this.apiUrl, cliente);
}
}