import { ChangeDetectionStrategy, Component, EventEmitter, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { NewPostService } from './new-post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewPostComponent implements OnInit {
  @Output() handlePostSucceeded = new EventEmitter();
  isDialogOpened: boolean = false;

  constructor(@Inject(TuiDialogService) private readonly dialogService: TuiDialogService, private newPostService: NewPostService) {}

  ngOnInit(): void {}

  onShowPostDialog(): void {
    if (!this.isDialogOpened) {
      this.isDialogOpened = true;
    }
  }

  handleAfterPosting() {
    this.handlePostSucceeded.emit();
    this.onCloseDialog();
  }

  onCloseDialog() {
    this.isDialogOpened = false;
    this.newPostService.clearStore();
  }
}
