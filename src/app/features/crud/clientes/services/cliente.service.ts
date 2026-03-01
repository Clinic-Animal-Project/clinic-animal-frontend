import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Cliente, CreateClienteDto, UpdateClienteDto } from '../models/cliente.model';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
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
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clientes`;

  getClientes(page: number = 0, size: number = 10): Observable<Cliente[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(resp => {
        // El API devuelve  { success, data: [...] }
        if (resp && resp.data) return resp.data as Cliente[];
        // O puede ser un array directo
        if (Array.isArray(resp)) return resp as Cliente[];
        return [];
      })
    );
  }

  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(resp => {
        if (resp && resp.data) return resp.data as Cliente;
        return resp as Cliente;
      })
    );
  }

  searchClientes(query: string): Observable<ApiResponse<Cliente[]>> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ApiResponse<Cliente[]>>(`${this.apiUrl}/search`, { params });
  }

  createCliente(cliente: CreateClienteDto): Observable<ApiResponse<Cliente>> {
    return this.http.post<ApiResponse<Cliente>>(this.apiUrl, cliente);
  }

  updateCliente(cliente: UpdateClienteDto): Observable<ApiResponse<Cliente>> {
    return this.http.put<ApiResponse<Cliente>>(`${this.apiUrl}/${cliente.id}`, cliente);
  }

  deleteCliente(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
