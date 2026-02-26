import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CitasRequest } from '../model/citas.model';

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  http = inject(HttpClient);
  apiUrl = 'http://localhost:8090/api/citas';
  registrarCita(citaData: CitasRequest): Observable<any> {
    return this.http.post(this.apiUrl, citaData);
  }

}
