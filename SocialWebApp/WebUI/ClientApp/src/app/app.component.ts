import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TUI_ARROW } from '@taiga-ui/kit';
import { SignalrService } from './services/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private route: Router, public signalRService: SignalrService) {}
  title = 'ClientApp';

  isNavBarVisible = false;

  ngDoCheck(): void {
    const currentRoute = this.route.url;
    currentRoute == '/auth/login' || currentRoute == '/auth/register' || currentRoute == '/error'
      ? (this.isNavBarVisible = false)
      : (this.isNavBarVisible = true);
  }
  readonly arrow = TUI_ARROW;

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addFriendListener();
  }
}
