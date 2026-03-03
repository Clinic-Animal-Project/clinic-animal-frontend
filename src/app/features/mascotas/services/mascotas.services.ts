import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Mascota, MascotaRequestDto } from '../../mascotas/models/mascotas.models';
import { API_ROUTES } from 'src/app/core/constants/api-routes';


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
export class MascotaService {
  private http = inject(HttpClient);
  private apiUrl = `${API_ROUTES.MASTER}/mascotas`;

listarMascotas(nombre: string): Observable<Mascota[]> {
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

registrarMascota(mascota: MascotaRequestDto): Observable<Mascota> {
  return this.http.post<any>(this.apiUrl, mascota);
}

obtenerMascotaPorId(id: number): Observable<ApiResponse<Mascota>> {
  return this.http.get<ApiResponse<Mascota>>(`${this.apiUrl}/${id}`);
}
}