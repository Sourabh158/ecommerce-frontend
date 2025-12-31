import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/public/products`);
  }

  addProduct(categoryId: number, product: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.post(`${this.baseUrl}/admin/categories/${categoryId}/product`, product, { headers });
  }

  updateProduct(productId: number, product: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.put(`${this.baseUrl}/admin/products/${productId}`, product, { headers });
  }

  // ✅ DELETE FIX: Token check aur response type fix
  deleteProduct(productId: number): Observable<any> {
    const token = localStorage.getItem('token');
    console.log("Deleting with Token:", token); // कंसोल में चेक करें

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.baseUrl}/admin/products/${productId}`, { 
      headers: headers, 
      responseType: 'text' 
    });
  }
}