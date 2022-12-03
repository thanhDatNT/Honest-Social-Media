import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageContainerComponent } from './message-container/message-container.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MessageContainerComponent,
        title: 'Message'
      }
    ])
  ],
  exports: [RouterModule]
})
export class MessagePageRoute {}
