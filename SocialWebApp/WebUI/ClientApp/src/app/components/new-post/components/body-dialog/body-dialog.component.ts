import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NewPostService } from '../../new-post.service';
import { PostService } from '../../../../services/post.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GlobalErrorHandler } from '../../../../services/error-handler.service';

@Component({
  selector: 'app-body-dialog',
  templateUrl: './body-dialog.component.html',
  styleUrls: ['./body-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BodyDialogComponent implements OnInit {
  @Output() handleOpenDialog = new EventEmitter();
  @Output() handlePostSucceeded = new EventEmitter();
  isSendingData: boolean = false;
  disablePosting = true;
  files: string[] = [];
  value = '';
  userId!: number;
  postForm = new FormGroup({
    postStatusValue: new FormControl(``, [statusValidator]),
    imageUrlsValue: new FormControl([])
  });
  constructor(
    private newPostService: NewPostService,
    private errorHandler: GlobalErrorHandler,
    private jwtHelper: JwtHelperService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.userId = +this.jwtHelper.decodeToken(localStorage.getItem('jwt') as string).sub;
    this.onImagesUploaded();
    this.postForm.statusChanges.subscribe(res => {
      this.disablePosting = this.postForm.value.postStatusValue?.trim() == '' && (this.newPostService.getRawImages() as never[]).length < 1;
    });
  }

  onPostSummited() {
    this.isSendingData = true;
    this.postForm.controls.imageUrlsValue.setValue(this.newPostService.getRawImages() as never[]);
    const formData = new FormData();

    this.postForm.value.imageUrlsValue?.forEach(image => {
      formData.append(`files`, image);
    });
    formData.append('status', this.postForm.value.postStatusValue || '');
    formData.append('userId', this.userId.toString());
    this.postService.createPost(formData).subscribe({
      next: res => {
        if (res) {
          this.isSendingData = false;
          this.newPostService.clearStore();
          this.handlePostSucceeded.emit();
        }
      },
      error: err => {
        this.isSendingData = false;
        this.errorHandler.handleError(new Error('Fail to post. Please try again.'));
      }
    });
  }

  onImagesUploaded() {
    this.files = this.newPostService.getImages();
    if (this.files.length > 0) {
      this.postForm.markAsDirty();
      this.disablePosting = false;
    }
  }
}

export function statusValidator(field: AbstractControl): Validators | null {
  if (field.value.length > 1000) return { other: `The maximum length of uploaded status is 1000 characters. Please try again.` };
  return null;
}
