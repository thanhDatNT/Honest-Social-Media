import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header-dialog',
  templateUrl: './header-dialog.component.html',
  styleUrls: ['./header-dialog.component.scss']
})
export class HeaderDialogComponent implements OnInit {
  @Output() closeDialog = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
