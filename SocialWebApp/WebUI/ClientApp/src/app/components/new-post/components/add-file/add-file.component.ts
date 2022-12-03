import { Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { NewPostService } from '../../new-post.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent implements OnInit {
  @Output() handleImagesUploaded = new EventEmitter();
  @Output() handleOpenPostDialog = new EventEmitter();

  constructor(@Inject(TuiDialogService) private readonly dialogService: TuiDialogService, private newPostService: NewPostService) {}

  ngOnInit(): void {}

  showDialog(content: TemplateRef<TuiDialogContext<void>>): void {
    this.dialogService.open(content, { dismissible: true }).subscribe();
  }
}
