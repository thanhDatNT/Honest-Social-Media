import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { IUser, IUserCommented } from '../../../../interface/user';

@Component({
  selector: 'app-comment-container',
  templateUrl: './comment-container.component.html',
  styleUrls: ['./comment-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommentContainerComponent implements OnInit {
  @Input() postId!: number;
  @Output() onRefreshPost = new EventEmitter();
  @Input() userCommentList!: IUserCommented[];

  constructor() {}

  ngOnInit(): void {}
}
