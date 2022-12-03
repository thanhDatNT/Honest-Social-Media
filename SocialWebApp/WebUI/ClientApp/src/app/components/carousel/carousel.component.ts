import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() imageUrls!: string[];
  @Input() disableButton: boolean = false;
  index = 0;

  constructor() {}

  ngOnInit(): void {}
}
