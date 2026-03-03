import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mascota } from '../model/mascotas.model';
import { ApiResponse } from 'src/app/core/models/response.model';
import { API_ROUTES } from 'src/app/core/constants/api-routes';

@Injectable({
  providedIn: 'root'
})
export class MascotasService {
  private http = inject(HttpClient);
  private apiUrl = `${API_ROUTES.MASTER}/mascotas`;

  getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.apiUrl);
  }

  getMascotaById(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.apiUrl}/${id}`);
  }

  createMascota(mascota: any): Observable<ApiResponse<Mascota>> {
    return this.http.post<ApiResponse<Mascota>>(this.apiUrl, mascota);
  }

  updateMascota(id: number, mascota: any): Observable<ApiResponse<Mascota>> {
    return this.http.put<ApiResponse<Mascota>>(`${this.apiUrl}/${id}`, mascota);
  }

  deleteMascota(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}