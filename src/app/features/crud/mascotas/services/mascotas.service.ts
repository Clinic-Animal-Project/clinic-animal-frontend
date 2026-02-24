import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Mascota } from '../model/mascotas.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MascotasService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/mascotas`;

  mascotas = signal<Mascota[]>([]);

  getMascotas() {
    return this.http.get<Mascota[]>(this.apiUrl);
  }

  getMascotaById(id: number) {
    return this.http.get<Mascota>(`${this.apiUrl}/${id}`);
  }

  createMascota(mascota: Omit<Mascota, 'id'>) {
    return this.http.post<Mascota>(this.apiUrl, mascota);
  }

  updateMascota(id: number, mascota: Partial<Mascota>) {
    return this.http.put<Mascota>(`${this.apiUrl}/${id}`, mascota);
  }

  deleteMascota(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
