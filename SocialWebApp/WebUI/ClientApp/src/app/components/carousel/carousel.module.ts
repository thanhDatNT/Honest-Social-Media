import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel.component';
import { TuiCarouselModule, TuiPaginationModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';

@NgModule({
  declarations: [CarouselComponent],
  imports: [CommonModule, TuiCarouselModule, TuiPaginationModule, TuiButtonModule],
  exports: [CarouselComponent]
})
export class CarouselModule {}
