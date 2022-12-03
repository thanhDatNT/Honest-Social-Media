import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUser } from '../../../../../interface/user';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { TuiSizeM, TuiSizeS } from '@taiga-ui/core';
import { PostService } from '../../../../../services/post.service';
import { GlobalErrorHandler } from '../../../../../services/error-handler.service';
import { IPost } from '../../../../../interface/post';
import { CurrentPostService } from '../../../current-post.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-user-comment',
  templateUrl: './user-comment.component.html',
  styleUrls: ['./user-comment.component.scss']
})
export class UserCommentComponent implements OnInit {
  @Input() postId!: number;
  @Output() onRefreshPost = new EventEmitter();
  userInfo: IUser | undefined;
  mockImage: string = environment.mockImg;
  size: TuiSizeM | TuiSizeS = `m`;
  commentValue = new FormControl(``, [commentValidator]);
  isSent: boolean = false;
  disablePost: boolean = false;

  constructor(
    private postService: PostService,
    private currentPostService: CurrentPostService,
    private errorHandler: GlobalErrorHandler,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchUserInfo();
    this.commentValue.statusChanges.subscribe(res => {
      this.disablePost = this.commentValue.value === '';
    });
  }

  fetchUserInfo(): void {
    this.userService.getUserInfo(this.currentPostService.getUserId(), this.currentPostService.getUserId()).subscribe({
      next: value => {
        this.userInfo = value;
      },
      error: (err: HttpErrorResponse) => {
        console.log('Cannot find user');
      }
    });
  }

  onPostComment() {
    const commentText: string | null = this.commentValue.value;
    if (commentText?.trim() === '') {
      this.commentValue.setErrors({ other: 'Comment has no value' });
      return;
    }
    this.isSent = true;
    this.disablePost = true;
    this.postService.commentPost(this.postId, this.currentPostService.getUserId(), commentText! || '.').subscribe({
      next: value => {
        this.commentValue.setValue('');
        this.currentPostService.updatePost(value);
        this.isSent = false;
        this.onRefreshPost.emit();
      },
      error: err => {
        this.errorHandler.handleError(err);
        this.isSent = false;
      }
    });
  }
}

export function commentValidator(field: AbstractControl): Validators | null {
  if (!field.value) return null;
  if (field.value.length > 100) return { other: `The maximum length of your comment is 100 characters. Please try again.` };
  return null;
}
