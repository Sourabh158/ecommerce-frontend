import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // अपना Preset यहाँ डालें
    data.append('cloud_name', 'YOUR_CLOUD_NAME'); // अपना Cloud Name यहाँ डालें

    return this.http.post('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', data);
  }
}