import { Component, OnDestroy, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IMessage, MessageContentType } from 'src/app/interface/message';
import { ISearchFriend, IUser } from 'src/app/interface/user';
import { MessageService } from 'src/app/services/message.service';
import { SignalrService } from 'src/app/services/message-signalr.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import * as _ from 'lodash';
import { MessageStoreService } from 'src/app/services/message-store.service';

@Component({
  selector: 'app-message-container',
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.scss']
})
export class MessageContainerComponent implements OnInit, OnDestroy {
  userId!: number;
  constructor(
    public jwtHelper: JwtHelperService,
    public signalRService: SignalrService,
    public messageService: MessageService,
    public messageStore: MessageStoreService,
    public userService: UserService,
    public notificationService: NotificationService
  ) {}
  ngOnDestroy(): void {
    this.signalRService.disconnect();
    this.messageStore.resetStore();
    this.messageStore.chosenFriend = undefined;
  }

  ngOnInit(): void {
    this.userId = +this.jwtHelper.decodeToken(localStorage.getItem('jwt') as string).sub;
    this.signalRService.connect(this.userId);
    this.getFriendsMessages();
    this.handleFetchSearchFriend = _.debounce(this.handleFetchSearchFriend, 300);
  }

  getMessage(): void {
    this.messageService
      .getMessages({
        userId: this.userId,
        friendId: this.messageStore.chosenFriend!.id,
        limit: this.messageStore.limit,
        offset: this.messageStore.offset
      })
      .subscribe({
        next: (value: any) => {
          this.messageStore.hasNextPage = value.hasNextPage;
          this.messageStore.offset += this.messageStore.limit;
          this.messageStore.messages = [...this.messageStore.messages, ...value.items];
        }
      });
  }
  getFriendsMessages(): void {
    const showHide = !!this.messageStore.chosenFriend;
    this.messageStore.isLoading = true;

    this.messageService.getFriendsMessages(this.userId, showHide).subscribe({
      next: value => {
        if (value.length > 0) {
          /* CASE: NAVIGATE FROM PROFILE PAGE */
          if (!this.messageStore.chosenFriend) {
            const latestMessage: IMessage = value[0];
            this.messageStore.chosenFriend = (
              latestMessage.senderId === this.userId ? latestMessage.receiver : latestMessage.sender
            ) as IUser;
          }
          this.messageStore.friendsMessages = value;
          this.getMessage();
        }
      },
      error: err => {
        console.log({ err });
        this.messageStore.isLoading = false;
      },
      complete: () => {
        this.messageStore.isLoading = false;
      }
    });
  }
  handleSendMessage(message: string): void {
    if (this.messageStore.chosenFriend) {
      const sendMessage = this.signalRService.buildChatMessage(
        message,
        this.userId,
        this.messageStore.chosenFriend.id,
        MessageContentType.TEXT
      );
      this.messageStore.messages = [sendMessage, ...this.messageStore.messages];

      /*HANDLE FIRST TIME SEND TO THIS FRIEND */

      this.messageService.addMessage(sendMessage).subscribe({
        next: value => {
          this.signalRService.updateFriendLastMessage(value);

          /*
          CHECK IF THIS USER EXIST IN CONTACT BOARD
          */
          if (
            !this.messageStore.friendsMessages.find(
              fm =>
                (fm.senderId === value.senderId && fm.receiverId === value.receiverId) ||
                (fm.receiverId === value.senderId && fm.senderId === value.receiverId)
            )
          ) {
            this.messageStore.friendsMessages.unshift(value);
          }
        },
        error: err => console.error(err)
      });
    }
  }
  handleSendPhoto(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      if (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg' && files[0].type !== 'image/jpg')
        return this.notificationService.showError('Image type is not supported');
      if (files[0].size > 2200000) return this.notificationService.showError('Image size cannot be larger than 2.2MB');

      // this.signalRService.sendFile(files[0], this.userId, this.signalRService.chosenFriend!.id, MessageContentType.IMAGE);
      const sendFile = this.signalRService.buildChatMessage(
        files[0] as unknown as string,
        this.userId,
        this.messageStore.chosenFriend!.id,
        MessageContentType.IMAGE
      );
      this.messageService.addPhoto(sendFile).subscribe({
        next: (value: IMessage) => {
          this.messageStore.messages = [value, ...this.messageStore.messages];
          this.signalRService.updateFriendLastMessage(value);
          if (
            !this.messageStore.friendsMessages.find(
              fm =>
                (fm.senderId === value.senderId && fm.receiverId === value.receiverId) ||
                (fm.receiverId === value.senderId && fm.senderId === value.receiverId)
            )
          ) {
            this.messageStore.friendsMessages.unshift(value);
          }
        }
      });
    }
  }
  handleSendDocument(e: Event) {
    const files = (e.target as HTMLInputElement).files;

    if (files) {
      if (
        files[0].type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
        files[0].type !== 'application/pdf' &&
        files[0].type !== 'text/plain' &&
        files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
        return this.notificationService.showError('Document type is not supported');
      if (files[0].size > 15000000) return this.notificationService.showError('Document size cannot be larger than 15MB');

      const sendFile = this.signalRService.buildChatMessage(
        files[0] as unknown as string,
        this.userId,
        this.messageStore.chosenFriend!.id,
        MessageContentType.DOC
      );
      this.messageService.addPhoto(sendFile).subscribe({
        next: (value: IMessage) => {
          this.messageStore.messages = [value, ...this.messageStore.messages];
          this.signalRService.updateFriendLastMessage(value);
          if (
            !this.messageStore.friendsMessages.find(
              fm =>
                (fm.senderId === value.senderId && fm.receiverId === value.receiverId) ||
                (fm.receiverId === value.senderId && fm.senderId === value.receiverId)
            )
          ) {
            this.messageStore.friendsMessages.unshift(value);
          }
        }
      });
    }
  }
  handleMarkAsRead(messageId: number) {
    const foundFriend = this.messageStore.friendsMessages.find(m => m.id === messageId);
    if (foundFriend && !foundFriend.isRead) {
      foundFriend.isRead = true;
      this.messageService.updateReadStatus(messageId).subscribe();
    }
  }
  handleContactClick({ chosenUser, messageId }: { chosenUser: IUser | undefined; messageId: number | undefined }): void {
    if (chosenUser && messageId) {
      if (!this.messageStore.friendsMessages.find(fm => fm.id === messageId)?.isRead) this.handleMarkAsRead(messageId);

      if (chosenUser.id === this.messageStore.chosenFriend?.id) return;
      this.messageStore.chosenFriend = chosenUser;
      this.messageStore.chosenFriend = chosenUser;
      this.messageStore.chosenFriend = chosenUser;
      this.messageStore.offset = 0;
      this.messageStore.messages = [];
      this.getMessage();
    }
  }
  handleMessageScroll() {
    if (this.messageStore.hasNextPage) this.getMessage();
  }
  handleSearchFriend(keyword: string) {
    this.messageStore.searchedFriends = [];
    this.handleFetchSearchFriend(keyword);
  }
  handleFetchSearchFriend(keyword: string) {
    if (keyword.trim()) {
      this.messageStore.isSearching = true;
      this.userService.searchFriends(this.userId, keyword).subscribe({
        next: value => {
          this.messageStore.searchedFriends = value.friends;
          this.messageStore.isSearching = false;
        },
        error: () => {
          this.messageStore.isSearching = false;
        }
      });
    }
  }

  handleClickSearchFriend(chosenUser: ISearchFriend) {
    this.messageStore.chosenFriend = chosenUser as IUser;
    this.messageStore.searchedFriends = [];

    /* NEED ENHANCE */
    this.messageStore.offset = 0;
    this.messageStore.messages = [];
    this.getMessage();
  }
  handleHideMessage(friendId: number) {
    const userID = this.userId;
    this.messageService.hideFriendMessage(this.userId, friendId).subscribe({
      error: err => {
        console.log({ err });
      }
    });

    this.messageStore.friendsMessages = this.messageStore.friendsMessages.filter(
      fm => !(fm.senderId === this.userId && fm.receiverId === friendId) && !(fm.senderId === friendId && fm.receiverId === this.userId)
    );
  }
}
