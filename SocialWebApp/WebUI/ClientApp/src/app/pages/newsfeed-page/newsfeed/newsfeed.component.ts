import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPost } from 'src/app/interface/post';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.scss']
})
export class NewsfeedComponent implements OnInit {
  @Output() handleReloadPage = new EventEmitter();
  @Input() posts: IPost[] = [];
  @Input() isLoading: boolean = false;
  @Output() onScroll = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
