import { Injectable } from '@angular/core';
import { IPost } from '../../interface/post';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class CurrentPostService {
  post!: IPost;
  userId!: number;

  constructor(private jwtHelper: JwtHelperService) {
    this.userId = +this.jwtHelper.decodeToken(localStorage.getItem('jwt') as string).sub;
  }

  getUserId(): number {
    return this.userId;
  }

  updatePost(updatedPost: IPost) {
    this.post = updatedPost;
  }

  getCurrentPost() {
    return this.post;
  }
}
