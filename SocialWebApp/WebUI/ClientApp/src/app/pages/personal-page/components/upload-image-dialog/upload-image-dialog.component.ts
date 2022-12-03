import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TuiFileLike } from '@taiga-ui/kit';
import { finalize, map, Observable, of, Subject, switchMap, timer } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-upload-image-dialog',
  templateUrl: './upload-image-dialog.component.html',
  styleUrls: ['./upload-image-dialog.component.scss']
})
export class UploadImageDialogComponent implements OnInit {
  @Input() observer: any;
  @Input() type!: 'avatar' | 'cover';
  @Output() onUploadPhotoSuccess = new EventEmitter();
  userId!: number;
  file!: File;
  imageUrl!: string | null;

  constructor(private userService: UserService, private notification: NotificationService, private jwtHelper: JwtHelperService) {}

  ngOnInit(): void {
    this.userId = +this.jwtHelper.decodeToken(localStorage.getItem('jwt') as string).sub;
  }

  loading: boolean = false;

  handleCloseDialog(observer: any) {
    observer.complete();
  }

  onSubmit(observer: any) {
    this.loading = true;
    const formData = new FormData();
    formData.append('formFile', this.file);
    this.userService.uploadPhoto(formData, this.userId, this.type).subscribe({
      next: res => {
        observer.complete();
        this.notification.showSuccess('Upload successfully!');
        this.onUploadPhotoSuccess.emit({ res, type: this.type });
        this.loading = false;
      },
      error: err => {
        console.log(err);
        this.notification.showError('Upload failed!');
        this.loading = false;
      }
    });
  }

  control = new FormControl();
  rejectedFiles$ = new Subject<TuiFileLike | null>();
  loadingFiles$ = new Subject<TuiFileLike | null>();
  rejectedState: Boolean = false;
  loadedFiles$ = this.control.valueChanges.pipe(
    switchMap(file => {
      return file ? this.makeRequest(file) : of(null);
    })
  );

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedState = true;
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
    this.rejectedState = false;
    this.imageUrl = null;
    this.control.setValue(null);
  }

  clearRejected(): void {
    this.removeFile();
    this.rejectedFiles$.next(null);
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);
    return timer(1000).pipe(
      map(() => {
        this.file = file as File;
        const reader = new FileReader();
        reader.readAsDataURL(file as File);
        reader.onload = () => {
          this.imageUrl = reader.result as string;
        };
        return file;
      }),
      finalize(() => this.loadingFiles$.next(null))
    );
  }
}
