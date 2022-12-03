import { Component, ElementRef, Inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TuiDialogService, TuiHostedDropdownComponent } from '@taiga-ui/core';
import { debounce, trim } from 'lodash';
import { ISearchUser, ISearchUserResponse } from 'src/app/interface/user';
import { NotificationService } from 'src/app/services/notification.service';
import { SignalrService } from 'src/app/services/signalr.service';
import { INotification } from './../../interface/notification';
import { NotificationStoreService } from './../../services/notification-store.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit, OnChanges {
  @ViewChild('searchInput') input!: ElementRef;
  isDialogOpened: boolean = false;

  constructor(
    private route: Router,
    private jwtHelper: JwtHelperService,
    private activatedRoute: ActivatedRoute,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private userService: UserService,
    public notificationStore: NotificationStoreService,
    private notificationService: NotificationService,
    public notificationSignalRService: SignalrService
  ) {
    this.onSearchInputChange = debounce(this.onSearchInputChange, 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.userId = +this.jwtHelper.decodeToken(localStorage.getItem('jwt') as string).sub;
  }

  @ViewChild(TuiHostedDropdownComponent)
  component?: TuiHostedDropdownComponent;
  userId!: number;
  profileItems = [{ label: 'See Your Profile', link: '/' }, { label: 'Log Out' }];
  isDropDownProfileVisible = false;
  isDropDownSearchVisible = false;
  isDropDownNotificationVisible = false;
  isOnProfilePage = false;
  isLoadingSearch = false;
  searchUsers: ISearchUser[] = [];
  onInput: boolean = false;

  toggleDropDown(itemIndex: number) {
    this.onNavigate();
  }

  onNotificationBtnClick() {
    this.notificationSignalRService.newNotification = false;
    if (!this.isDropDownNotificationVisible) {
      this.notificationStore.notifications = [];
      this.notificationStore.isLoading = true;
      this.notificationStore.getNotifications(this.userId).subscribe({
        next: res => {
          this.notificationStore.notifications = res;
        },
        error: err => {},
        complete: () => {
          this.notificationStore.isLoading = false;
        }
      });
    }
  }

  toggleDropDownProfile(itemIndex: number) {
    if (itemIndex === 1) this.showDialog();
    this.isDropDownProfileVisible = !this.isDropDownProfileVisible;
    this.onNavigate();
  }

  ngDoCheck(): void {
    const currentRoute = this.route.url;
    currentRoute.includes('/profile') == true ? (this.isOnProfilePage = true) : (this.isOnProfilePage = false);
    if (currentRoute.includes('/search?') && this.input.nativeElement.value === '' && !this.onInput) {
      this.input.nativeElement.value = localStorage.getItem('searchString');
    }
  }

  ngOnInit() {
    const token = localStorage.getItem('jwt');
    if (token !== null) {
      this.userId = +this.jwtHelper.decodeToken(token as string).sub;
      this.profileItems[0].link = '/profile/' + this.userId;
    }
  }

  showDialog(): void {
    this.isDialogOpened = true;
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
    this.route.navigate(['auth/login']);
  }

  onSearch(event: KeyboardEvent) {
    this.onInput = true;
    if (this.input.nativeElement.value === '') return;
    if (event.key == 'Enter') {
      localStorage.setItem('searchString', this.input.nativeElement.value);
      this.onSearchEnter();
    } else {
      this.isLoadingSearch = true;
      this.onSearchInputChange();
    }
  }

  onSearchInputChange() {
    var value: string = trim(this.input.nativeElement.value);
    if (value.length != 0) {
      this.userService.searchUser(this.userId, value, 0, 5).subscribe({
        next: (res: ISearchUserResponse) => {
          this.searchUsers = res.users;
        },
        error: err => {
          console.log(err);
        },
        complete: () => {
          this.isLoadingSearch = false;
        }
      });
    } else {
      this.searchUsers = [];
      this.isLoadingSearch = false;
    }
  }

  toggleDropDownSearch() {
    this.isDropDownSearchVisible = true;
    if (this.input.nativeElement.value !== '') {
      this.isLoadingSearch = true;
      this.onSearchInputChange();
    }
  }

  onSearchEnter() {
    this.isDropDownSearchVisible = false;
    this.route.navigateByUrl('/', { skipLocationChange: false }).then(() => {
      this.route.navigate(['search'], { queryParams: { searchString: trim(this.input.nativeElement.value) } });
    });
  }

  onNavigate() {
    this.input.nativeElement.value = '';
    this.searchUsers = [];
  }
  onConfirmFriendRequest(item: INotification) {
    this.userService.handleFriendRequest(this.userId, item.triggerUser.id, true).subscribe({
      next: res => {
        var itemIndex = this.notificationStore.notifications.indexOf(item);
        this.notificationStore.notifications.splice(itemIndex, 1);
        this.notificationService.showSuccess(`Now, You and ${item.triggerUser.firstName + ' ' + item.triggerUser.lastName} is the friend`);
      },
      error: err => {},
      complete: () => {}
    });
    return;
  }

  onDeclineFriendRequest(item: INotification) {
    this.userService.handleFriendRequest(this.userId, item.triggerUser.id, false).subscribe({
      next: res => {
        var itemIndex = this.notificationStore.notifications.indexOf(item);
        this.notificationStore.notifications.splice(itemIndex, 1);
      },
      error: err => {},
      complete: () => {}
    });
    return;
  }
}
