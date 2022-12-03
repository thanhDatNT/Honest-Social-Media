import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from 'src/app/services/user.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ISearchUser, IUser } from 'src/app/interface/user';

@Component({
  selector: 'app-user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.scss']
})
export class UserInfoCardComponent implements OnInit {
  @Input() user!: ISearchUser;
  @Output() onNavigateMessage = new EventEmitter<IUser>();
  loggedInUserId!: number;
  isLoading: boolean = false;
  constructor(private route: Router, private userService: UserService, private jwtHelper: JwtHelperService) {}

  ngOnInit(): void {
    this.loggedInUserId = +this.jwtHelper.decodeToken(localStorage.getItem('jwt') as string).sub;
  }

  handleOnButtonPress() {
    console.log(this.user.relationship);

    if (this.user.relationship === 0) {
      this.route.navigate(['profile/' + this.user.id]);
    } else if (this.user.relationship === 4) {
      this.isLoading = true;
      this.userService.handleFriendRequest(this.loggedInUserId, this.user.id, true).subscribe({
        next: res => {
          this.user.relationship = 1;
        },
        error: err => {},
        complete: () => {
          this.isLoading = false;
        }
      });
    } else if (this.user.relationship === 1) {
      this.onNavigateMessage.emit(this.user as IUser);
    } else if (this.user.relationship === 2) {
      this.isLoading = true;
      this.userService.addFriendRequest(this.loggedInUserId, this.user.id).subscribe({
        next: res => {
          this.user.relationship = 3;
        },
        error: err => {},
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onDeclineFriendRequest() {
    this.userService.handleFriendRequest(this.loggedInUserId, this.user.id, false).subscribe({
      next: res => {
        this.user.relationship = 2;
      },
      error: err => {},
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
