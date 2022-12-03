import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/pages/shared.module';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogModule,
  TuiErrorModule,
  TuiExpandModule,
  TuiGroupModule,
  TuiHostedDropdownModule,
  TuiPrimitiveTextfieldModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import {
  TuiActionModule,
  TuiAvatarModule,
  TuiDataListDropdownManagerModule,
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiProgressModule,
  TuiTextAreaModule
} from '@taiga-ui/kit';
import { PluralPipe } from 'src/app/pipes/plural.pipe';
import { PostComponent } from './post.component';
import { CarouselModule } from '../carousel/carousel.module';
import { DeleteComponent } from './components/delete/delete.component';
import { TuiActiveZoneModule, TuiLetModule } from '@taiga-ui/cdk';
import { CommentContainerComponent } from './components/comment-container/comment-container.component';
import { UserCommentComponent } from './components/comment-container/user-comment/user-comment.component';
import { CommunityCommentsComponent } from './components/comment-container/community-comments/community-comments.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PostComponent, PluralPipe, DeleteComponent, CommentContainerComponent, UserCommentComponent, CommunityCommentsComponent],
  imports: [
    CommonModule,
    TuiAvatarModule,
    TuiSvgModule,
    CarouselModule,
    TuiButtonModule,
    TuiHostedDropdownModule,
    TuiDataListDropdownManagerModule,
    TuiActiveZoneModule,
    TuiLetModule,
    TuiTextfieldControllerModule,
    TuiDataListModule,
    TuiExpandModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiGroupModule,
    TuiTextAreaModule,
    TuiPrimitiveTextfieldModule,
    TuiActionModule,
    SharedModule,
    TuiProgressModule,
    TuiDialogModule
  ],
  exports: [PostComponent]
})
export class PostModule {}
