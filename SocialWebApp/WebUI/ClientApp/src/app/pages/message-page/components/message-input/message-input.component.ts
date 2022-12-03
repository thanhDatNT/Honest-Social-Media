import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent implements OnInit {
  @Output() onSend = new EventEmitter<string>();
  @Output() onSendPhoto = new EventEmitter<Event>();
  @Output() onSendDocument = new EventEmitter<Event>();

  messageText: string = '';
  constructor() {}

  handleSendMessage() {
    if (this.messageText.trim()) {
      this.onSend.emit(this.messageText);
      this.messageText = '';
    }
  }

  ngOnInit(): void {}
}
