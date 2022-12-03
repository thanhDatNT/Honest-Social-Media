import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-brand-logo',
  templateUrl: './brand-logo.component.html',
  styleUrls: ['./brand-logo.component.scss']
})
export class BrandLogoComponent implements OnInit {
  @Input() public authTitle: string = '';
  @Input() public authDescription: string = '';

  constructor() {}

  ngOnInit(): void {}
}
