import { Search2Component } from './search/search2.component';
import { SearchComponent } from './search/search.component';
import { AppMaterialModule } from '../app.material';
import { CommonModule } from '@angular/common';
import { DesignerComponent } from './designer/designer.component';
import { EditorComponent } from './editor/editor.component';
import { EditorControlComponent } from './editor/editor-control/editor-control.component';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgPipesModule } from 'angular-pipes';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { ProjectsComponent } from './projects/projects.component';
import { VenueComponent } from './venues/venue/venue.component';
import { VenueContentDetailComponent } from './venues/venue-content-detail/venue-content-detail.component';
import { VenueContentFacilityComponent } from './venues/venue-content-facility/venue-content-facility.component';
import { VenueContentLocationComponent } from './venues/venue-content-location/venue-content-location.component';
import { VenuesComponent } from './venues/venues.component';
import { FiltersComponent } from './search/filters/filters.component';
import { PipesModule } from '../pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { Search3Component } from './search/search3/search3.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormlyMaterialModule,
    FormlyModule,
    PrettyJsonModule,
    FormsModule,
    NgPipesModule,
    AppMaterialModule,
    PipesModule ,
  ],
  declarations: [
    DesignerComponent,
    EditorComponent,
    EditorControlComponent,
    // DataTableComponent,
    // EditDialogComponent,
    // ModellerComponent,
    ProjectsComponent,
    VenuesComponent,
    VenueComponent,
    VenueContentDetailComponent,
    VenueContentFacilityComponent,
    VenueContentLocationComponent,
    FiltersComponent,
    SearchComponent,
    Search2Component,
    Search3Component,
    // AutocompleteOptgroupExample,
  ],
  // entryComponents: [EditDialogComponent]
})
export class ComponentsModule {}
