import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IMessage } from '../interface/message';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { sendMessage } from '@microsoft/signalr/dist/esm/Utils';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageBaseApiUrl = environment.baseApi + '/chat';
  constructor(private http: HttpClient) {}

  public addMessage(sendMessage: IMessage) {
    return this.http.post<IMessage>(this.messageBaseApiUrl, sendMessage);
  }
  public addPhoto(sendPhoto: IMessage) {
    const formData = new FormData();
    Object.keys(sendPhoto).forEach(key => {
      formData.append(key, sendPhoto[key as keyof typeof sendMessage]);
    });
    return this.http.post<IMessage>(this.messageBaseApiUrl + '/file', formData);
  }

  public getMessages(params: { userId: number; friendId: number; limit: number; offset: number }) {
    return this.http.get(this.messageBaseApiUrl, { params: { ...params } });
  }
  public updateReadStatus(messageId: number) {
    return this.http.put(this.messageBaseApiUrl, {}, { params: { messageId } });
  }
  public getFriendsMessages(userId: number, showHide: boolean = false): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.messageBaseApiUrl + '/users', { params: { userId, showHide } });
  }
  public hideFriendMessage(userId: number, friendId: number) {
    return this.http.put(this.messageBaseApiUrl + '/hide', { userId, friendId });
  }
}
