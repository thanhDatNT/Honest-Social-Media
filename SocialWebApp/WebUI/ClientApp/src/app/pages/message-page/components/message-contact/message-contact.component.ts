import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IMessage, MessageContentType } from 'src/app/interface/message';
import { IUser } from 'src/app/interface/user';

@Component({
  selector: 'app-message-contact',
  templateUrl: './message-contact.component.html',
  styleUrls: ['./message-contact.component.scss']
})
export class MessageContactComponent implements OnChanges {
  @Input() friendMessage!: IMessage;
  @Input() userId!: number;
  @Output() onContactClick = new EventEmitter<{ chosenUser: IUser | undefined; messageId: number | undefined }>();
  @Output() onHideMessage = new EventEmitter<number>();
  isLastSendFromCurrentUser: boolean = false;
  messageContentType = MessageContentType;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log({ changes });
    if (this.friendMessage.receiverId === this.userId) this.isLastSendFromCurrentUser = false;
    else this.isLastSendFromCurrentUser = true;
  }
}
