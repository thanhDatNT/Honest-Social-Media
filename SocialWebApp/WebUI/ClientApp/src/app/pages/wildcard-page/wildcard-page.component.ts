import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wildcard-page',
  templateUrl: './wildcard-page.component.html',
  styleUrls: ['./wildcard-page.component.scss']
})
export class WildcardPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(['/error']);
  }
}
