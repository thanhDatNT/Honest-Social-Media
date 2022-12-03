import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IPost } from 'src/app/interface/post';
import { IUser } from 'src/app/interface/user';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-newsfeed-container',
  templateUrl: './newsfeed-container.component.html',
  styleUrls: ['./newsfeed-container.component.scss']
})
export class NewsfeedContainerComponent implements OnInit {
  posts: IPost[] = [];
  isLoading: boolean = false;
  hasNextPage: boolean = false;
  userId: number = 0;
  limit: number = 7;
  offset: number = 0;
  loggedInUser: IUser | undefined;

  constructor(private postService: PostService, private jwtHelper: JwtHelperService, private userService: UserService) {}

  ngOnInit(): void {
    this.userId = +this.jwtHelper.decodeToken(localStorage.getItem('jwt') as string).sub;
    this.fetchPosts();
    this.fetchLoggedInUserInfo();
  }

  handleReloadPage() {
    this.posts = [];
    this.offset = 0;
    this.fetchPosts();
  }
  fetchPosts(): void {
    this.isLoading = true;
    this.postService.getNewsfeedPost(this.userId, this.offset, this.limit).subscribe({
      next: value => {
        this.posts = [...this.posts, ...value.items];
        this.hasNextPage = value.hasNextPage;
        this.offset += this.limit;
      },
      error: error => {
        console.log({ error });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  handleOnScroll() {
    if (this.hasNextPage) {
      this.fetchPosts();
    }
  }

  fetchLoggedInUserInfo() {
    this.userService.getUserInfo(this.userId, this.userId).subscribe({
      next: res => {
        this.loggedInUser = res;
      },
      error: err => {},
      complete: () => {}
    });
  }
}
