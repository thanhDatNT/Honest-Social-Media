import { Injectable } from '@angular/core';
import { IMessage } from '../interface/message';
import { ISearchFriend, IUser } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class MessageStoreService {
  public messages: IMessage[] = [];
  public friendsMessages: IMessage[] = [];
  public chosenFriend: IUser | undefined;
  public searchedFriends: ISearchFriend[] = [];
  public isLoading: boolean = false;
  public isSearching: boolean = false;
  public offset: number = 0;
  public limit: number = 10;
  public hasNextPage: boolean = true;
  constructor() {}

  resetStore() {
    this.friendsMessages = [];
    this.messages = [];
    this.offset = 0;
    this.hasNextPage = true;
  }
}
