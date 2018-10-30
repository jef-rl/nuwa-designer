import { SearchComponent } from './components/search/search.component';
import { DesignerComponent } from './components/designer/designer.component';
import { EditorComponent } from './components/editor/editor.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { Routes } from '@angular/router';
import { VenuesComponent } from './components/venues/venues.component';
import { Search2Component } from './components/search/search2.component';
import { PreviewsComponent } from './previews/previews.component';
import { Search3Component } from './components/search/search3/search3.component';
// import { ModellerComponent } from './components/modeller/modeller.component';

export const AppRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'projects',
        component: ProjectsComponent
      },
      {
        path: 'venues',
        component: VenuesComponent
      },
      {
        path: 'designer',
        component: DesignerComponent
      },
      {
        path: 'preview',
        component: PreviewsComponent
      },
      {
        path: 'editor',
        component: EditorComponent
      },
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: 'search2',
        component: Search2Component
      },
      {
        path: 'search3',
        component: Search3Component
      },
      {
        path: 'venue/:venuesDash',
        component: VenuesComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];
