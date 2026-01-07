import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); // ✅ लोकल स्टोरेज से टोकन उठाएं

  if (token) {
    // ✅ रिक्वेस्ट को क्लोन करें और ऑथराइजेशन हेडर जोड़ें
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};