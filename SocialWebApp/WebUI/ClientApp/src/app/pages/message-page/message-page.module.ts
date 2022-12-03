import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiDataListModule, TuiDropdownModule, TuiHintModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiInputFilesModule, TuiTextAreaModule } from '@taiga-ui/kit';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MessageTimePipe } from 'src/app/pipes/message-time.pipe';
import { SharedModule } from '../shared.module';
import { MessageContactComponent } from './components/message-contact/message-contact.component';
import { MessageInputComponent } from './components/message-input/message-input.component';
import { UserMessageComponent } from './components/user-message/user-message.component';
import { MessagePageRoute } from './mesage-page.route';
import { MessageContainerComponent } from './message-container/message-container.component';
import { MessageComponent } from './message/message.component';

@NgModule({
  declarations: [MessageComponent, MessageContainerComponent, MessageContactComponent, UserMessageComponent, MessageInputComponent],
  imports: [
    CommonModule,
    MessagePageRoute,
    TuiAvatarModule,
    TuiSvgModule,
    FormsModule,
    SharedModule,
    TuiInputFilesModule,
    TuiLoaderModule,
    InfiniteScrollModule,
    TuiDropdownModule,
    TuiDataListModule,
    TuiTextAreaModule,
    TuiHintModule
  ]
})
export class MessagePageModule {}
