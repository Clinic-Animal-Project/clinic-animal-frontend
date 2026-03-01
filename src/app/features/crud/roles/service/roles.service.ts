import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiResponse } from "../../clientes/services/cliente.service";
import { RolesResponse } from "../model/roles.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/roles`;

  listarRoles(): Observable<RolesResponse[]> {
    return this.http.get<ApiResponse<RolesResponse[]>>(this.apiUrl).pipe(
      map(resp => resp.data ?? [])
    );
  }

 
}