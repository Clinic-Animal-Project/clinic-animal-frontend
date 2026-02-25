import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class JwtDecoderService {
  decodedToken:any;
  constructor() { }

  decodeToken(): JwtPayload | null {
    const token = sessionStorage.getItem('auth_token');
    return this.decodeTokenFromString(token);
  }

  decodeTokenFromString(token: string | null): any {
    if (token) {
      try {
        return jwtDecode<any>(token);
      } catch (error) {
        console.error('Invalid token:', error);
        return null;
      }
    }
    return null;
  }
}