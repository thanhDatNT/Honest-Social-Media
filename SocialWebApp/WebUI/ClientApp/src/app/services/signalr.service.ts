import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { INotification } from '../interface/notification';
import { environment } from './../../environments/environment';
import { NotificationStoreService } from './notification-store.service';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  constructor(private notificationStore: NotificationStoreService) {}

  private hubConnection!: signalR.HubConnection;
  public notification!: INotification;
  newNotification: boolean = false;
  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.baseUrl}/notificationService`, { accessTokenFactory: () => localStorage.getItem('jwt') as string })
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  };

  addFriendListener = () => {
    this.hubConnection.on('addFriendNotification', res => {
      this.newNotification = true;
      this.notificationStore.notifications = [res, ...this.notificationStore.notifications];
    });
  };
}
