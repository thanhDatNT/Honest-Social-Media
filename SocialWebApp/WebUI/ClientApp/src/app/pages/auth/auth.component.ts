import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {
  newUser: boolean = true;

  constructor(private route: Router) {}

  ngOnInit(): void {
    this.newUser = this.route.url.includes('/login');

    this.route.events.subscribe(() => {
      this.newUser = this.route.url.includes('/login');
    });
  }
}
