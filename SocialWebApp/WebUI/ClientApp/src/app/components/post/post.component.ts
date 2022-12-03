import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IPost, LikeStatus } from 'src/app/interface/post';
import { environment } from 'src/environments/environment';
import { PostService } from '../../services/post.service';
import { NotificationService } from '../../services/notification.service';
import { GlobalErrorHandler } from '../../services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrentPostService } from './current-post.service';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnChanges, OnInit {
  @ViewChild('postStatusRef')
  postStatusRef!: ElementRef;
  @Input() post!: IPost;
  @Output() onDeletePost = new EventEmitter();
  mockImg: string = environment.mockImg;
  hasSeeMore: boolean = false;
  isLiked: boolean = false;
  postImages: string[] = [];
  expanded = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('post')) {
      if (changes['post'].firstChange) {
        this.hasSeeMore = this.post.status?.length! > 250;
        this.isLiked = this.post.postLikes.some(p => this.currentPostService.getUserId() === p.userId);
      }
    }
  }
  constructor(
    private postService: PostService,
    private notification: NotificationService,
    private errorHandler: GlobalErrorHandler,
    private currentPostService: CurrentPostService,
    private route: Router
  ) {}

  ngOnInit(): void {
    if (this.post.photos) {
      this.post.photos.forEach(p => {
        this.postImages.push(p.photo);
      });
    }
    this.handleUpdatePostLike = _.debounce(this.handleUpdatePostLike, 500);
  }

  onSeeMore(): void {
    this.hasSeeMore = false;
    this.postStatusRef.nativeElement.style.setProperty('--line-to-show', 0);
  }

  handlePostDeleted() {
    this.postService.deletePost(this.post.id, this.currentPostService.getUserId()).subscribe({
      next: value => {
        if (value.items) {
          this.notification.showSuccess('Delete post successfully');
          this.onDeletePost.emit();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  handleToggleLikePost() {
    this.isLiked = !this.isLiked;
    let status: LikeStatus;
    const checkPostLiked = this.post.postLikes.find(p => p.userId === this.currentPostService.getUserId());

    if (checkPostLiked) {
      status = LikeStatus.UNLIKE;
      this.post.numberOfLikes--;
      this.post.postLikes = this.post.postLikes.filter(p => p.userId !== this.currentPostService.getUserId());
    } else {
      status = LikeStatus.LIKE;
      this.post.numberOfLikes++;
      this.post.postLikes = [...this.post.postLikes, { postId: this.post.id, userId: this.currentPostService.getUserId() }];
    }

    this.handleUpdatePostLike(status);
  }

  handleUpdatePostLike(status: LikeStatus): void {
    this.postService.likePost(this.post.id, this.currentPostService.getUserId(), status).subscribe({
      next: value => {
        this.post = value;
      },
      error: err => {
        console.log({ err });
      }
    });
  }

  toggleCommentExpand(): void {
    this.expanded = !this.expanded;
  }

  onRefreshPost() {
    this.post = this.currentPostService.getCurrentPost();
  }

  canPostDeleted(): boolean {
    return this.post.user.id === this.currentPostService.getUserId();
  }

  handleNavigateAccount(userId: number) {
    this.route.navigateByUrl(`/profile/${userId}`, { skipLocationChange: false }).then(() => {});
  }
}
