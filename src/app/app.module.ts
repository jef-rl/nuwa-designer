import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AppComponent } from './app.component';
import { AppMaterialModule } from './app.material';
import { AppRoutes } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from './components/components.module';
import { EditorControlService } from './services/editor.service';
import { environment } from '../environments/environment';
import { FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { MAT_DATE_LOCALE } from '@angular/material';
import { NgModule } from '@angular/core';
import { NgPipesModule } from 'angular-pipes';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { ProjectService } from './services/project.service';
import { RouterModule } from '@angular/router';

import { FormlyMaterialModule } from '@ngx-formly/material';
import { ArrayTypeComponent } from './-ngx-formly-extensions/arrary.type';
import { SearchService, Search2Service } from './services/search.service';
import { PipesModule } from './pipes/pipes.module';
import { PreviewsModule } from './previews/previews.module';

export function minlengthValidationMessage(err, field) {
  return `Should have atleast ${field.templateOptions.minLength} characters`;
}

export function maxlengthValidationMessage(err, field) {
  return `This value should be less than ${
    field.templateOptions.maxLength
  } characters`;
}

export function minValidationMessage(err, field) {
  return `This value should be more than ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.max}`;
}

@NgModule({
  declarations: [AppComponent, ArrayTypeComponent],
  imports: [
    PrettyJsonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    PipesModule,
    FormlyMaterialModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
        { name: 'minlength', message: minlengthValidationMessage },
        { name: 'maxlength', message: maxlengthValidationMessage },
        { name: 'min', message: minValidationMessage },
        { name: 'max', message: maxValidationMessage }
      ],
      types: [
        { name: 'string', extends: 'input' },
        {
          name: 'number',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number'
            }
          }
        },
        {
          name: 'integer',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number'
            }
          }
        },
        { name: 'object', extends: 'formly-group' },
        { name: 'boolean', extends: 'checkbox' },
        { name: 'array', component: ArrayTypeComponent },
        { name: 'enum', extends: 'select' }
      ]
    }),
    HttpClientModule,
    // AngularFireModule.initializeApp(environment.firebase,'admin'),
    AngularFireModule.initializeApp(environment.firebasespa, 'spa'),
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    FormsModule,
    NgPipesModule,
    AppMaterialModule,
    ComponentsModule,
    PreviewsModule,
    MarkdownModule.forRoot(),
    RouterModule.forRoot(AppRoutes)
  ],
  exports: [RouterModule],
  providers: [
    ProjectService,
    SearchService, Search2Service,
    EditorControlService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
