import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { debounce, trim } from 'lodash';
import { ISearchFriend, IUser } from 'src/app/interface/user';
import { GlobalErrorHandler } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friend-tab',
  templateUrl: './friend-tab.component.html',
  styleUrls: ['./friend-tab.component.scss']
})
export class FriendTabComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @Input() user: IUser | undefined;
  constructor(private userService: UserService, private jwtHelper: JwtHelperService, private errorHandler: GlobalErrorHandler) {}
  friendList: ISearchFriend[] = [];
  isLoading: boolean = false;
  hasNextPage: boolean = false;
  limit: number = 6;
  offset: number = 0;

  ngOnInit(): void {
    this.handleSearchFriend(false);
    this.handleSearchFriend = debounce(this.handleSearchFriend, 1000);
  }

  onScroll() {
    if (this.hasNextPage && !this.isLoading) {
      this.handleSearchFriend(true);
    }
  }

  onSearchInputChange() {
    this.friendList = [];
    this.isLoading = true;
    if (trim(this.searchInput.nativeElement.value) === '') {
      setTimeout(() => {
        this.friendList = [];
        this.isLoading = false;
      }, 500);
    } else {
      this.handleSearchFriend(false);
    }
  }

  handleSearchFriend(isScrolling: boolean) {
    if (!isScrolling) {
      this.friendList = [];
      this.hasNextPage = false;
      this.offset = 0;
    }
    this.isLoading = true;
    var value: string = '';
    if (this.searchInput) value = trim(this.searchInput.nativeElement.value);
    if (this.user) {
      this.userService.searchFriends(this.user.id, value, this.offset, this.limit).subscribe({
        next: res => {
          this.friendList = [...this.friendList, ...res.friends];
          this.offset += this.limit;
          this.hasNextPage = res.hasNextPage;
        },
        error: err => {
          this.errorHandler.handleError(new Error('Fail to search friends!'));
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
