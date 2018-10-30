import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuwaFormComponent } from './form/form.component';

export const NUWAFORMCOMPONENTS = [NuwaFormComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [NUWAFORMCOMPONENTS],
  exports: [NUWAFORMCOMPONENTS]
})
export class NuwaModule {}
