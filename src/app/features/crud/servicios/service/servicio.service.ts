import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
import { ServicioResponse } from '../model/servicio.model';
import { ApiResponse } from 'src/app/shared/interface/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/servicios`;

    listarServicios(): Observable<ServicioResponse[]> {
    return this.http.get<ApiResponse<ServicioResponse[]>>(this.apiUrl).pipe(
      map(resp => resp.data ?? [])
    );

  }
}
