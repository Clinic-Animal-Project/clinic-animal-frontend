import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mascota } from '../model/mascotas.model';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from 'src/app/core/models/response.model';

@Injectable({
  providedIn: 'root'
})
export class MascotasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/mascotas`;

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