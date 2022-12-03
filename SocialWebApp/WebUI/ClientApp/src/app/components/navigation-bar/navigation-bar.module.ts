import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogModule,
  TuiDropdownModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiSvgModule
} from '@taiga-ui/core';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { SharedModule } from 'src/app/pages/shared.module';
import { RelationshipPipe } from 'src/app/pipes/relationship.pipe';
import { NavigationBarComponent } from './navigation-bar.component';

@NgModule({
  declarations: [NavigationBarComponent, RelationshipPipe],
  imports: [
    CommonModule,
    TuiLoaderModule,
    TuiSvgModule,
    TuiHostedDropdownModule,
    TuiDataListModule,
    RouterModule,
    TuiButtonModule,
    TuiDialogModule,
    TuiDropdownModule,
    TuiAvatarModule,
    SharedModule
  ],
  exports: [NavigationBarComponent]
})
export class NavigationBarModule {}
