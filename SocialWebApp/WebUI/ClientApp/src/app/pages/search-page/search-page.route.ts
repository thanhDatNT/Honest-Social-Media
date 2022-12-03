import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchPageContainerComponent } from './search-page-container/search-page-container.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SearchPageContainerComponent,
        title: 'Search Result'
      }
    ])
  ],
  exports: [RouterModule]
})
export class SearchPageRoute {}
