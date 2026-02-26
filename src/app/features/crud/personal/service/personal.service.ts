import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/interface/api-response.interface';
import { PersonalResponse } from '../model/personal.model';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/personal`;

    listarPersonal(): Observable<PersonalResponse[]> {
    return this.http.get<ApiResponse<PersonalResponse[]>>(this.apiUrl).pipe(
      map(resp => resp.data ?? [])
    );

}
}