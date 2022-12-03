import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import { environment } from 'src/environments/environment';
import { IMessage, IMessageHub, MessageContentType } from '../interface/message';
import { messageHubParser } from '../utils/parser';
import { MessageStoreService } from './message-store.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public hubConnection!: HubConnection;

  constructor(public messageService: MessageService, public messageStore: MessageStoreService) {}

  public connect = (userId: number) => {
    this.startConnection();
    this.addListeners(userId);
  };
  public disconnect = () => {
    this.hubConnection.stop();
  };
  public sendMessage(message: string, senderId: number, receiverId: number, type: MessageContentType) {
    const sendMessage = this.buildChatMessage(message, senderId, receiverId, type);
    this.messageStore.messages = [sendMessage, ...this.messageStore.messages];
    this.updateFriendLastMessage(sendMessage);
    return this.messageService.addMessage(sendMessage);
  }
  public sendFile(file: File, senderId: number, receiverId: number, type: MessageContentType) {
    const sendFile = this.buildChatMessage(file as unknown as string, senderId, receiverId, type);
    this.messageService.addPhoto(sendFile).subscribe({
      next: (value: IMessage) => {
        this.messageStore.messages = [value, ...this.messageStore.messages];
        this.updateFriendLastMessage(value);
      }
    });
  }

  public addUserToGroup(userId: number) {
    var promise = this.hubConnection
      .invoke('AddUserToGroupAsync', userId)
      .then(() => {})
      .catch(err => console.log('error while sending a message to hub: ' + err));

    return promise;
  }

  public getConnection(): HubConnection {
    return new HubConnectionBuilder()
      .withUrl(environment.baseUrl + '/signalr')
      .withHubProtocol(new MessagePackHubProtocol())
      .build();
  }

  public buildChatMessage(content: string, senderId: number, receiverId: number, type: MessageContentType): IMessage {
    return {
      content,
      type,
      receiverId,
      createdAt: new Date(),
      isRead: false,
      senderId
    };
  }

  public async startConnection() {
    // this.hubConnection.
    this.hubConnection = this.getConnection();
    this.hubConnection
      .start()
      .then(() => {})
      .catch(err => {
        console.log('error while establishing signalr connection: ');
      });
  }
  public updateFriendLastMessage(lastMessage: IMessage) {
    this.messageStore.friendsMessages = this.messageStore.friendsMessages.map(i => {
      if (
        (i.senderId === lastMessage.senderId && i.receiverId === lastMessage.receiverId) ||
        (i.receiverId === lastMessage.senderId && i.senderId === lastMessage.receiverId)
      ) {
        return lastMessage;
      }
      return i;
    });
  }
  public addListeners(userId: number) {
    this.hubConnection.on('messageReceivedFromApi', (data: IMessageHub) => {
      console.log('message received from API Controller');
      const parsedData = messageHubParser(data);
      console.log({ parsedData });
      /*
        CASE: FIRST TIME RECEIVE FROM THIS USER
     */
      if (
        !this.messageStore.friendsMessages.find(
          fm =>
            (fm.receiverId === parsedData.senderId && fm.senderId === parsedData.receiverId) ||
            (fm.receiverId === parsedData.receiverId && fm.senderId === parsedData.senderId)
        )
      ) {
        this.messageStore.friendsMessages.unshift(parsedData);
      } else {
        if (parsedData.senderId === this.messageStore.chosenFriend?.id)
          this.messageStore.messages = [messageHubParser(data), ...this.messageStore.messages];
        this.updateFriendLastMessage(parsedData);
      }
    });

    this.hubConnection.on('newUserConnected', async _ => {
      await this.addUserToGroup(userId);
    });
  }
}
