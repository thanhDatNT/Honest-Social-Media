import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPost } from 'src/app/interface/post';
import { IUser } from 'src/app/interface/user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent {
  @Input() userNotFound: boolean = false;
  @Input() userInfo: IUser | undefined;
  @Input() personalPosts!: IPost[];
  @Input() isLoading: boolean = false;
  @Input() uploadedAvatar: any;
  @Input() loggedInUserId!: number;
  @Input() isLoadingFriendRequest!: boolean;
  @Output() onScroll = new EventEmitter();
  @Output() onUploadPhotoClick = new EventEmitter();
  @Output() onPhotoUpload = new EventEmitter();
  @Output() handlePostSucceeded = new EventEmitter();
  @Output() handleDeletePost = new EventEmitter();
  @Output() handleOnActionPress = new EventEmitter();
  @Output() onMessageClick = new EventEmitter();
  @Output() handleDeclineFriendRequest = new EventEmitter();
  activeItemIndex: number = 0;
  mockImg: string = environment.mockImg;
  uploadType!: 'avatar' | 'cover';
  constructor() {}
}
