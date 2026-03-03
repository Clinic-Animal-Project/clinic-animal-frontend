import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiResponse } from "../../clientes/services/cliente.service";
import { RolesResponse } from "../model/roles.model";
import { HttpClient } from "@angular/common/http";
import { API_ROUTES } from "src/app/core/constants/api-routes";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  http = inject(HttpClient);
  private apiUrl = `${API_ROUTES.MASTER}/roles`;

  listarRoles(): Observable<RolesResponse[]> {
    return this.http.get<ApiResponse<RolesResponse[]>>(this.apiUrl).pipe(
      map(resp => resp.data ?? [])
    );
  }

 
}