import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PersonalContainerComponent } from './personal-container/personal-container.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: PersonalContainerComponent,
        title: 'Personal'
      }
    ])
  ],
  exports: [RouterModule]
})
export class PersonalPageRoute {}
