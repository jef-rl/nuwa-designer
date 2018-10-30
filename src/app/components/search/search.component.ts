import { MatSelectChange, MatAutocompleteSelectedEvent } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { map, startWith, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SearchFilter, VenueDoc, SearchResult } from './../../services/search.service';
import { SearchService } from '../../services/search.service';

export interface StateGroup {
  heading: string;
  tags: { tag: string; count: number; ids: string[] }[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  distance = 25;
  searchControl = new FormControl();
  matches: Observable<any>;
  criteria$: Observable<SearchFilter>;

  constructor(private search: SearchService, private fb: FormBuilder) {
    this.matches = this.search.getMatches();
    this.criteria$ = this.search.getCriteria();
    const watchMatches = this.matches.pipe(
      tap(matches => {
        console.log(matches);
      })
    ).subscribe();
  }

  displayFn(group?: { text: string; tag: string; count: number; ids: string[] }): string | undefined {
    return group && group.tag ? group.tag.slice(0, group.text.length) : undefined;
  }

  ngOnInit() {
    const autocomp = this.searchControl.valueChanges
      .pipe(
        startWith<string | SearchResult>(''),
        tap(criteria => {
          this.search.filterText(criteria);
        })
      )
      .subscribe();
  }
  reset() {
    this.searchControl.setValue({ type: 'all', text: '' });
    this.search.filterText('');
  }
  setDistance(maxDistance: number) {
    this.distance = maxDistance;
    this.search.filterDistance(maxDistance);
  }
}

// /**
//  * @title Option groups autocomplete
//  */
// @Component({
//   selector: 'app-ac-og',
//   template: `<form [formGroup]="stateForm">
//   <mat-form-field>
//     <input type="text" matInput placeholder="States Group" formControlName="stateGroup" required [matAutocomplete]="autoGroup">
//       <mat-autocomplete #autoGroup="matAutocomplete">
//         <mat-optgroup *ngFor="let group of stateGroupOptions | async" [label]="group.letter">
//           <mat-option *ngFor="let name of group.names" [value]="name">
//             {{name}}
//           </mat-option>
//       </mat-optgroup>
//     </mat-autocomplete>
//   </mat-form-field>
// </form>`
// })
// export class AutocompleteOptgroupExample implements OnInit {
//   stateForm: FormGroup = this.fb.group({
//     stateGroup: ''
//   });

//   stateGroups: StateGroup[] =

//   stateGroupOptions: Observable<StateGroup[]>;

//   constructor(private fb: FormBuilder) {}

//   ngOnInit() {
//     this.stateGroupOptions = this.stateForm
//       .get('stateGroup')!
//       .valueChanges.pipe(
//         startWith(''),
//         map(value => this._filterGroup(value))
//       );
//   }

//   private _filterGroup(value: string): StateGroup[] {
//     if (value) {
//       return this.stateGroups
//         .map(group => ({
//           letter: group.letter,
//           names: _filter(group.names, value)
//         }))
//         .filter(group => group.names.length > 0);
//     }

//     return this.stateGroups;
//   }
// }
