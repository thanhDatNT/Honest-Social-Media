import { WildcardPageComponent } from './pages/wildcard-page/wildcard-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './pages/error-page/error.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { AccessGuard } from './guard/access.guard';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: async () => (await import('./pages/newsfeed-page/newsfeed-page.module')).NewsfeedPageModule,
    canActivate: [AccessGuard]
  },
  {
    path: 'profile',
    loadChildren: async () => (await import('./pages/personal-page/personal-page.module')).PersonalPageModule,
    canActivate: [AccessGuard]
  },
  {
    path: 'auth',
    loadChildren: async () => (await import('./pages/auth/auth.module')).AuthModule,
    canActivate: [AuthGuard]
  },
  {
    path: 'message',
    loadChildren: async () => (await import('./pages/message-page/message-page.module')).MessagePageModule,
    canActivate: [AccessGuard]
  },
  {
    path: 'search',
    loadChildren: async () => await (await import('./pages/search-page/search-page.module')).SearchResultPageModule,
    canActivate: [AccessGuard]
  },
  {
    path: 'notification',
    component: NotificationComponent
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  { path: '**', component: WildcardPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
