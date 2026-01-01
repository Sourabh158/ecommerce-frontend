import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Apne Backend ka Port check kar lena (8080 ya jo bhi ho)
  private apiUrl = 'https://ecommerce-backend-x8kd.onrender.com/api/auth'; 

  constructor(private http: HttpClient) {}

  // auth.service.ts के अंदर

signin(loginData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, loginData);
  
  }

  // Register waala function wesa hi rahega
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}