import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../../services/user.service';
import { IUser } from '../../../../interface/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  userInfo: IUser | undefined;
  userId!: number;
  userNotFound: boolean = false;

  constructor(private userService: UserService, private jwtHelper: JwtHelperService) {}

  ngOnInit(): void {
    this.userId = +this.jwtHelper.decodeToken(localStorage.getItem('jwt') as string).sub;
    this.fetchUserInfo();
  }

  fetchUserInfo(): void {
    this.userService.getUserInfo(this.userId, this.userId).subscribe({
      next: value => {
        this.userInfo = value;
      },
      error: (err: HttpErrorResponse) => {
        this.userNotFound = true;
      }
    });
  }
}
