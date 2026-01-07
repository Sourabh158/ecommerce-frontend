import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  // 1. अपना Cloud Name यहाँ डालें (जो आपके डैशबोर्ड के मुख्य पेज पर था)
  private cloudName = 'dxp5ltkg1'; // आपके स्क्रीनशॉट में ऊपर कोने में यही दिख रहा है
  
  // 2. अपना Upload Preset यहाँ डालें
  private uploadPreset = 'mmq3m8su';

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', this.uploadPreset); // यहाँ mmq3m8su इस्तेमाल होगा

    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    return this.http.post(url, data);
  }
}