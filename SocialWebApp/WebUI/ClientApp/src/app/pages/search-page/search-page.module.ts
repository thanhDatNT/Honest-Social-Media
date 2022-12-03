import { TuiAvatarModule } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { SearchPageContainerComponent } from './search-page-container/search-page-container.component';
import { SearchPageRoute } from './search-page.route';
import { SearchPageComponent } from './search-page/search-page.component';
import { UserInfoCardComponent } from './components/user-info-card/user-info-card.component';
import { ButtonRelationshipPipe } from 'src/app/pipes/relationship.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [SearchPageContainerComponent, SearchPageComponent, UserInfoCardComponent, ButtonRelationshipPipe],
  imports: [CommonModule, SearchPageRoute, TuiLoaderModule, TuiButtonModule, InfiniteScrollModule, TuiAvatarModule]
})
export class SearchResultPageModule {}
