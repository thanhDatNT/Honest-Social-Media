import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent {
  dropdownOpen = false;
  isDialogOpened: boolean = false;

  @Output() handlePostDeleted = new EventEmitter();

  constructor(@Inject(TuiDialogService) private readonly dialogService: TuiDialogService) {}

  deletePost(): void {
    this.handlePostDeleted.emit();
    this.dropdownOpen = false;
  }

  handleOpenDialog() {
    this.isDialogOpened = true;
  }
}
