import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AreasResponse } from '../model/areas.model';
import { environment } from "../../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "../../../../shared/interface/api-response.interface";

@Injectable({
  providedIn: 'root'
})
export class AreasService {

    http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/areas`;

    listarAreas(): Observable<AreasResponse[]> {
    return this.http.get<ApiResponse<AreasResponse[]>>(this.apiUrl).pipe(
      map(resp => resp.data ?? [])
    );
}
    
}