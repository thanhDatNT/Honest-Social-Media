import { IUser, IUserHub } from './user';

export interface IMessage {
  id?: number;
  content: string;
  type: MessageContentType;
  createdAt: Date;
  isRead: boolean;
  senderId: number;
  receiverId: number;
  sender?: IUser;
  receiver?: IUser;
}
export interface IMessageHub {
  Id?: number;
  Content: string;
  Type: MessageContentType;
  CreatedAt: Date;
  IsRead: boolean;
  SenderId: number;
  ReceiverId: number;
  Sender: IUserHub;
  Receiver: IUserHub;
}

export enum MessageContentType {
  TEXT,
  IMAGE,
  DOC
}

export enum MessageType {
  SEND,
  RECEIVE
}
