import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  constructor(private http: HttpClient) {}

  getUserPhotos(userId: number, offset: number, limit: number) {
    return this.http.get(`${environment.baseApi}/photo`, {
      params: {
        userId,
        limit,
        offset
      }
    });
  }
}
