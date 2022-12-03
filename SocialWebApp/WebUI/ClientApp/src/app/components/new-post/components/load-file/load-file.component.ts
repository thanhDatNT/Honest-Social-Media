import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk';
import { TuiFileLike } from '@taiga-ui/kit';
import { NewPostService } from '../../new-post.service';

@Component({
  selector: 'app-load-file',
  templateUrl: './load-file.component.html',
  styleUrls: ['./load-file.component.scss']
})
export class LoadFileComponent implements OnInit {
  @Output() closeDialog = new EventEmitter();
  @Output() sendImages = new EventEmitter();
  readonly control = new FormControl([], [maxFilesLength(10)]);
  rejectedFiles: readonly TuiFileLike[] = [];

  constructor(private newPostService: NewPostService) {}

  ngOnInit(): void {
    this.control.valueChanges.subscribe(response => {
      if (this.control.status === 'VALID') {
        this.newPostService.emptyRawImages();
        response?.forEach(file => {
          this.newPostService.setRawImages(file as File);
        });
      }
    });

    this.handleCheckImagesInStore();
  }

  handleCheckImagesInStore() {
    const rawImagesArray: File[] = this.newPostService.getRawImages();
    if (rawImagesArray.length > 0) {
      this.control.setValue(rawImagesArray as never[]);
    }
  }

  onReject(files: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles = [...this.rejectedFiles, ...(files as TuiFileLike[])];
  }

  removeFile({ name }: File): void {
    this.newPostService.removeRawImages(name);
    this.control.setValue(this.control.value?.filter((current: File) => current.name !== name) ?? []);
  }

  clearRejected({ name }: TuiFileLike): void {
    this.rejectedFiles = this.rejectedFiles.filter(rejected => rejected.name !== name);
  }

  onSubmittedFiles() {
    this.newPostService.addImages().then(() => {
      this.sendImages.emit();
      this.onCloseDialog();
    });
  }

  onCloseDialog() {
    this.closeDialog.emit();
  }
}

export function maxFilesLength(maxLength: number): ValidatorFn {
  return ({ value }: AbstractControl) => {
    return value.length > maxLength
      ? {
          maxLength: new TuiValidationError(`The maximum number of uploaded photo is 10 photos`)
        }
      : null;
  };
}
