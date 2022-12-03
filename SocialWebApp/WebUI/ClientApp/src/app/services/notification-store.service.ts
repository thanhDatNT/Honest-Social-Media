import { HttpClient } from '@angular/common/http';
import { INotification } from './../interface/notification';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationStoreService {
  constructor(private http: HttpClient) {}

  public notifications: INotification[] = [];
  public isLoading: boolean = false;
  public offset: number = 0;
  public limit: number = 10;
  public hasNextPage: boolean = true;

  getNotifications(userId: number) {
    return this.http.get<INotification[]>(`${environment.baseApi}/user/notification`, {
      params: {
        userId
      }
    });
  }
}
