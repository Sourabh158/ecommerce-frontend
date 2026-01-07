import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs'; // ✅ tap इम्पोर्ट करें

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://ecommerce-backend-x8kd.onrender.com/api/auth'; 

  constructor(private http: HttpClient) {}

  signin(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginData).pipe(
      tap((response: any) => {
        // ✅ लॉगिन सफल होने पर टोकन और यूजर डेटा सेव करें
        if (response && (response.jwtToken || response.token)) {
          const token = response.jwtToken || response.token;
          localStorage.setItem('token', token);
          localStorage.setItem('username', response.username || '');
          console.log('Login Successful, Token Stored! ✅');
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // ✅ लॉगआउट फंक्शन भी जोड़ लें
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    location.reload(); // पेज रिफ्रेश करें
  }

  // ✅ चेक करने के लिए कि यूजर लॉगिन है या नहीं
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}