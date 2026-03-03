import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AreasResponse } from '../model/areas.model';
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "../../../../shared/interface/api-response.interface";
import { API_ROUTES } from "src/app/core/constants/api-routes";

@Injectable({
  providedIn: 'root'
})
export class AreasService {

    http = inject(HttpClient);
    private apiUrl = `${API_ROUTES.MASTER}/areas`;

    listarAreas(): Observable<AreasResponse[]> {
    return this.http.get<ApiResponse<AreasResponse[]>>(this.apiUrl).pipe(
      map(resp => resp.data ?? [])
    );
}
    
}