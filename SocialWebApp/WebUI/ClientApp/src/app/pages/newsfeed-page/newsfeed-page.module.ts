import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiButtonModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PostModule } from 'src/app/components/post/post.module';
import { NewsfeedContainerComponent } from './newsfeed-container/newsfeed-container.component';
import { NewsfeedPageRoute } from './newsfeed-page.route';
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { NewPostModule } from '../../components/new-post/new-post.module';
import { TuiAvatarModule } from '@taiga-ui/kit';

@NgModule({
  declarations: [NewsfeedComponent, NewsfeedContainerComponent],
  imports: [
    CommonModule,
    NewsfeedPageRoute,
    PostModule,
    TuiButtonModule,
    TuiSvgModule,
    PostModule,
    InfiniteScrollModule,
    TuiLoaderModule,
    NewPostModule,
    TuiAvatarModule
  ]
})
export class NewsfeedPageModule {}
