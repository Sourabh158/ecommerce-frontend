import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); // ✅ ब्राउज़र से टोकन लेना

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // ✅ हर रिक्वेस्ट में टोकन चिपकाना
      }
    });
    return next(cloned);
  }

  return next(req);
};