import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFromNowPipe } from '../pipes/date.pipe';
import { MessageTimePipe } from '../pipes/message-time.pipe';

@NgModule({
  declarations: [DateFromNowPipe, MessageTimePipe],
  imports: [CommonModule],
  exports: [DateFromNowPipe, MessageTimePipe]
})
export class SharedModule {}
