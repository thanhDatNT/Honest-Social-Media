import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ISearchUser, IUser } from 'src/app/interface/user';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {
  @Input() userList!: ISearchUser[];
  @Input() isLoading: boolean = false;
  @Output() onScroll = new EventEmitter();
  @Output() onNavigateMessage = new EventEmitter<IUser>();
  constructor() {}

  ngOnInit(): void {}
}
