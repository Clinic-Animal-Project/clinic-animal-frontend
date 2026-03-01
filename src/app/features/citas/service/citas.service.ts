import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CitasRequest, CitasResponse, EstadoCita } from '../model/citas.model';
import { ApiResponse } from 'src/app/shared/interface/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  http = inject(HttpClient);
  apiUrl = 'http://localhost:8090/api/citas';

  registrarCita(citaData: CitasRequest): Observable<any> {
    return this.http.post(this.apiUrl, citaData);
  }

  listarCitas(): Observable<ApiResponse<CitasResponse[]>> {
      return this.http.get<ApiResponse<CitasResponse[]>>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<CitasResponse> {
    return this.http.get<ApiResponse<CitasResponse>>(`${this.apiUrl}/${id}`).pipe(
      map(resp => resp.data as CitasResponse)
    );
  }

  listarPorEstados(estado:EstadoCita): Observable<CitasResponse[]> {
      return this.http.get<ApiResponse<CitasResponse[]>>(`${this.apiUrl}/estado`,{params: {estado}}).pipe(
        map(resp => resp.data ?? [])
      );
  }

  cambiarEstadoCitaEncola(id: number, idVeterinario: number): Observable<CitasResponse> {
    console.log({id,idVeterinario})
    return this.http.patch<ApiResponse<CitasResponse>>(`${this.apiUrl}/${id}/encolar`, { idVeterinario }).pipe(
      map(resp => resp?.data as CitasResponse)
    );
  }

  cambiarEstadoCitaEnProgreso(id: number): Observable<CitasResponse> {
    return this.http.patch<ApiResponse<CitasResponse>>(`${this.apiUrl}/${id}/iniciar`, null).pipe(
      map(resp => resp?.data as CitasResponse)
    );
  }

  cambiarEstadoCitaEnTerminada(id: number): Observable<CitasResponse> {
    return this.http.patch<ApiResponse<CitasResponse>>(`${this.apiUrl}/${id}/terminar`, null).pipe(
      map(resp => resp?.data as CitasResponse)
    );
  }

  cambiarEstadoCitaEnPagada(id: number): Observable<CitasResponse> {
    return this.http.patch<ApiResponse<CitasResponse>>(`${this.apiUrl}/${id}/pagar`, null).pipe(
      map(resp => resp?.data as CitasResponse)
    );
  }

  cambiarEstadoCitaACancelada(id: number): Observable<CitasResponse> {
    return this.http.patch<ApiResponse<CitasResponse>>(`${this.apiUrl}/${id}/cancelar`, null).pipe(
      map(resp => resp?.data as CitasResponse)
    );
  }

  reprogramarCita(id: number, fechaHora: string): Observable<CitasResponse> {
    return this.http.patch<ApiResponse<CitasResponse>>(`${this.apiUrl}/${id}/reprogramar`, { fechaHora }).pipe(
      map(resp => resp?.data as CitasResponse)
    );
  }

  listadoPorCliente(idCliente: number): Observable<CitasResponse[]> {
    return this.http.get<ApiResponse<CitasResponse[]>>(`${this.apiUrl}/cliente/${idCliente}`).pipe(
      map(resp => resp.data ?? [])
    );
  }

  listadoPorMascota(idMascota: number): Observable<CitasResponse[]> {
    return this.http.get<ApiResponse<CitasResponse[]>>(`${this.apiUrl}/mascota/${idMascota}`).pipe(
      map(resp => resp.data ?? [])
    );
  }
}
