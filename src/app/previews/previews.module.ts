import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewsComponent } from './previews.component';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from '../app.material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from 'angular-pipes';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgPipesModule,
    AppMaterialModule,
    PipesModule ,
  ],
  declarations: [PreviewsComponent]
})
export class PreviewsModule { }
