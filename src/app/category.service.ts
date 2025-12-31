import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // ✅ HttpHeaders add kiya
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = "http://localhost:8080/api";

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/public/categories`);
  }

  // ✅ Token ke saath category add karne ke liye
  createCategory(categoryData: any): Observable<any> {
    const token = localStorage.getItem('token'); // localStorage se token uthaya
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // ✅ Token ko headers mein dala
    });

    return this.http.post(`${this.baseUrl}/admin/categories`, categoryData, { headers });
  }
}