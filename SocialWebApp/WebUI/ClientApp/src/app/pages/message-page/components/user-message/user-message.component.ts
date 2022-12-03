import { Component, Input, OnInit } from '@angular/core';
import { IMessage, MessageContentType, MessageType } from 'src/app/interface/message';
import { IUser } from 'src/app/interface/user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.scss']
})
export class UserMessageComponent implements OnInit {
  @Input() message!: IMessage;
  @Input() type!: MessageType;
  @Input() chosenFriend: IUser | undefined;
  messageType = MessageType;
  messageContentType = MessageContentType;
  mockImg: string = environment.mockImg;
  constructor() {}

  ngOnInit(): void {}
}
