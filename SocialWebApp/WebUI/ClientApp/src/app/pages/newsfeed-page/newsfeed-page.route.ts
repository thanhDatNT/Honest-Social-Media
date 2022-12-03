import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewsfeedContainerComponent } from './newsfeed-container/newsfeed-container.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: NewsfeedContainerComponent,
        title: 'Newsfeed'
      }
    ])
  ],
  exports: [RouterModule]
})
export class NewsfeedPageRoute {}
