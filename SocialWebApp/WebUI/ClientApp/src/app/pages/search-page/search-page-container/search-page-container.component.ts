import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { trim } from 'lodash';
import { ISearchUser, IUser } from 'src/app/interface/user';
import { MessageStoreService } from 'src/app/services/message-store.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-search-page-container',
  templateUrl: './search-page-container.component.html',
  styleUrls: ['./search-page-container.component.scss']
})
export class SearchPageContainerComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private messageStore: MessageStoreService
  ) {}
  searchString: string = '';
  userList: ISearchUser[] = [];
  userId!: number;
  hasNextPage: boolean = false;
  isLoading: boolean = false;
  limit: number = 8;
  offset: number = 0;

  ngOnInit(): void {
    this.userId = +this.jwtHelper.decodeToken(localStorage.getItem('jwt') as string).sub;
    this.route.queryParams.subscribe((params: any) => {
      this.searchString = trim(params['searchString']);
      this.userList = [];
      this.offset = 0;
      this.onSearchUser();
    });
  }

  onSearchUser() {
    this.isLoading = true;
    if (this.searchString === '') {
      this.userList = [];
      this.isLoading = false;
      return;
    }
    this.userService.searchUser(this.userId, this.searchString, this.offset, this.limit).subscribe({
      next: res => {
        this.userList = [...this.userList, ...res.users];
        this.offset += this.limit;
        this.hasNextPage = res.hasNextPage;
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  handleOnScroll() {
    if (this.hasNextPage) {
      this.onSearchUser();
    }
  }
  handleNavigateMessage(userInfo: IUser) {
    console.log(userInfo);

    if (userInfo) {
      this.messageStore.chosenFriend = userInfo;
      this.router.navigate(['/message']);
    }
  }
}
