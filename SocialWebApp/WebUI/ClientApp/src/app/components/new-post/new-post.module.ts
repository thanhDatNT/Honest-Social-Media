import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPostComponent } from './new-post.component';
import { TuiAvatarModule, TuiFieldErrorPipeModule, TuiInputFilesModule, TuiIslandModule, TuiTextAreaModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiDialogModule, TuiErrorModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { HeaderDialogComponent } from './components/header-dialog/header-dialog.component';
import { BodyDialogComponent } from './components/body-dialog/body-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import { AddFileComponent } from './components/add-file/add-file.component';
import { LoadFileComponent } from './components/load-file/load-file.component';
import { CarouselModule } from '../carousel/carousel.module';

@NgModule({
  declarations: [NewPostComponent, HeaderDialogComponent, BodyDialogComponent, UserInfoComponent, AddFileComponent, LoadFileComponent],
  exports: [NewPostComponent],
  imports: [
    CommonModule,
    TuiIslandModule,
    TuiButtonModule,
    TuiSvgModule,
    TuiDialogModule,
    ReactiveFormsModule,
    TuiAvatarModule,
    TuiTextAreaModule,
    TuiTextfieldControllerModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    FormsModule,
    TuiAutoFocusModule,
    TuiInputFilesModule,
    CarouselModule
  ]
})
export class NewPostModule {}
