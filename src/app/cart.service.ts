import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) { }

  // ✅ Helper: Token logic को यहाँ फिक्स किया गया है
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json'
    });
  }

  // 1. Get Cart
  getCart(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  // 2. Add to Cart
  addToCart(productId: number, quantity: number = 1): Observable<any> {
    const url = `${this.apiUrl}/products/${productId}/quantity/${quantity}`;
    return this.http.post(url, {}, { headers: this.getHeaders() });
  }

  // 3. Remove Item
  removeFromCart(productId: number): Observable<any> {
    const url = `${this.apiUrl}/products/${productId}`;
    return this.http.delete(url, { headers: this.getHeaders(), responseType: 'text' });
  }

  // 4. Update Quantity
  updateQuantity(productId: number, quantity: number): Observable<any> {
    const url = `${this.apiUrl}/products/${productId}/quantity/${quantity}`;
    return this.http.put(url, {}, { headers: this.getHeaders() });
  }

  // 5. Place Order (Razorpay के लिए)
  placeOrder(orderData: any): Observable<any> {
    const url = 'http://localhost:8080/api/order/place'; 
    return this.http.post(url, orderData, { headers: this.getHeaders() });
  }

  // ✅ 6. Get User Orders (इसी में 'th' वाला एरर था, अब फिक्स है)
  getUserOrders(): Observable<any> {
    const url = 'http://localhost:8080/api/order/user';
    return this.http.get(url, { headers: this.getHeaders() });
  }
}