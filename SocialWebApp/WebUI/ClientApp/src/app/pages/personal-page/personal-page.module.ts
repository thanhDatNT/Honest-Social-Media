import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiDialogModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiInputFilesModule, TuiTabsModule } from '@taiga-ui/kit';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PostModule } from 'src/app/components/post/post.module';
import { GenderPipe } from 'src/app/pipes/gender.pipe';
import { InfoItemComponent } from './components/info-item/info-item.component';
import { PersonalContainerComponent } from './personal-container/personal-container.component';
import { PersonalPageRoute } from './personal-page.route';
import { PersonalComponent } from './personal/personal.component';
import { UploadImageDialogComponent } from './components/upload-image-dialog/upload-image-dialog.component';
import { PhotoTabComponent } from './components/photo-tab/photo-tab.component';
import { NewPostModule } from '../../components/new-post/new-post.module';
import { FriendTabComponent } from './components/friend-tab/friend-tab.component';
import { ProfileButtonRelationshipPipe } from 'src/app/pipes/relationship.pipe';

@NgModule({
  declarations: [
    PersonalComponent,
    PersonalContainerComponent,
    InfoItemComponent,
    GenderPipe,
    UploadImageDialogComponent,
    PhotoTabComponent,
    FriendTabComponent,
    ProfileButtonRelationshipPipe
  ],
  imports: [
    CommonModule,
    PersonalPageRoute,
    TuiTabsModule,
    TuiAvatarModule,
    TuiButtonModule,
    TuiSvgModule,
    InfiniteScrollModule,
    TuiLoaderModule,
    PostModule,
    TuiInputFilesModule,
    ReactiveFormsModule,
    TuiDialogModule,
    NewPostModule
  ]
})
export class PersonalPageModule {}
