import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/interface/api-response.interface';
import { PersonalResponse, RegistrarUsuarioInputDTO } from '../model/personal.model';
import { API_ROUTES } from 'src/app/core/constants/api-routes';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  http = inject(HttpClient);
  private apiUrl = `${API_ROUTES.MASTER}/personal`;
  private authUrl = `${API_ROUTES.AUTH}/usuario`;

  listarPersonal(): Observable<PersonalResponse[]> {
    return this.http.get<ApiResponse<PersonalResponse[]>>(this.apiUrl).pipe(
      map(resp => resp.data ?? [])
    );
  }

  registrarPersonal(dto: RegistrarUsuarioInputDTO): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/registrar`, dto);
  }

  eliminarPersonal(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}