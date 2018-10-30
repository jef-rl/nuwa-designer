import { tap, startWith } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Search2Service } from '../../../services/search.service';

@Component({
  selector: 'app-search3',
  templateUrl: './search3.component.html',
  styleUrls: ['./search3.component.scss']
})
export class Search3Component implements OnInit {
  searchControl = new FormControl();
  criteria: any;
  activeColumns = 4;
  activeGutter = '10px';
  isSmallScreen = false;

  showFilters = true;
  Venues: any;
  autoCompleteLocations: any;
  autoCompleteVenues: any;
  selectedLocation: any;
  constructor(public search: Search2Service) {
    const watchCriteria = search
      .Criteria()
      .pipe(
        tap(criteria => {
          this.criteria = criteria;
        })
      )
      .subscribe();
    const watchVenues = search
      .Selection()
      .pipe(
        tap(selected => {
          this.Venues = selected && selected.venues ? selected.venues : [];
          this.selectedLocation = selected;
          console.log(selected);
        })
      )
      .subscribe();
      const watchAutoCompleteLocations = search
      .AutoCompleteLocations()
      .pipe(
        tap(locations => {
          this.autoCompleteLocations = locations;
        })
      )
      .subscribe();
      const watchAutoCompleteVenues = search
      .AutoCompleteVenues()
      .pipe(
        tap(venues => {
          this.autoCompleteVenues = venues;
        })
      )
      .subscribe();
  }

  displayFn(group?: { text: string; tag: string; count: number; ids: string[] }): string | undefined {
    console.log('criteria : ', this.criteria);
    return group && group.tag && group.text ? group.tag.slice(0, group.text.length) : undefined;
    // return group && group.tag ? group.tag : undefined;
  }

  ngOnInit() {
    const autocomp = this.searchControl.valueChanges
      .pipe(
        startWith<string>(''),
        tap(criteria => {
          if (typeof criteria === 'string') {
            this.search.Text(criteria);
          } else {
            this.search.Select(criteria);
          }
        })
      )
      .subscribe();
  }
  reset() {
    this.searchControl.setValue('');
    this.search.Text('');
  }
  getStars(rating: number): string[] {
    let stars = ['star', 'star', 'star', 'star', 'star'].slice(0, Math.floor(rating));
    if (rating % 1 < 0.5) {
      stars = [...stars, 'star_border'];
    } else if (rating % 1 >= 0.5) {
      stars = [...stars, 'star_half'];
    }
    stars = [...stars, 'star_border', 'star_border', 'star_border', 'star_border', 'star_border'].slice(0, 5);
    return stars;
  }

  getLocationValue(group, criteria) {
    return { ...group, text : criteria && criteria.searchText ? criteria.searchText : '' };
  }
  getVenueValue(group, criteria) {
    return { ...group, text : criteria && criteria.searchText ? criteria.searchText : '' };
  }
}
