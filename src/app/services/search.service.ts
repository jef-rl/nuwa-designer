import { VENUE_LOCATIONS } from './venue.locations';
import { VenuesComponent } from './../components/venues/venues.component';
import { OUTCODEs, OUTTEXTs } from './outcodes';
import { SearchResult } from './search.service';
import * as _ from 'lodash';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, combineLatest, Observable, interval } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
// tslint:disable:curly

export interface SearchFilter {
  type?: string;
  text?: string;
  maxDistance?: number;
  minPrice?: number;
  maxPrice?: number;
  minNights?: number;
  maxNights?: number;
  minPeople?: number;
  maxPeople?: number;
  selected?: any | null;
}

export interface VenuePck {
  avail: number[];
  fromDate: string;
  fromPrice: string;
  id: string;
  nights: number;
  people: number;
  toDate: string;
  toPrice: string;
}

export interface VenueDoc {
  id: string;
  addr: string;
  dash: string;
  img: string;
  lat: number;
  lng: number;
  map: string;
  name: string;
  pcks: VenuePck[];
  phne: string;
  rate: number;
  sbid: number;
  street: string;
  town: string;
  region: string;
  country: string;
  postcode: string;
  web: string;
  distance?: number;
}
export interface OutcodeDoc {
  out: string;
  lng: number;
  lat: number;
  sector?: string;
  place?: string;
  town?: string;
  region?: string;
  label?: string;
}

export interface Outcode2Doc {
  out: string;
  lng: number;
  lat: number;
  sector?: string;
  place?: string;
  town?: string;
  region?: string;
  label?: string;
  venuesIn50?: VenueDoc[];
  venues?: VenueDoc[];
  match?: {
    out: boolean;
    sector: boolean;
    place: boolean;
    town: boolean;
    region: boolean;
  };
}

export interface SearchResult {
  text: string;
  type: string;
  tag: string;
  count: number;
  near: number;
  venues: string[];
}
export interface SearchSelection {
  type: string;
  tag: string;
}
export function getDistanceInMiles(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d * 0.621371;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private _filter: SearchFilter = { maxDistance: 25 };

  match$: BehaviorSubject<SearchResult[]> = new BehaviorSubject(null);

  filter$: BehaviorSubject<SearchFilter> = new BehaviorSubject(null);
  venue$: BehaviorSubject<VenueDoc[]> = new BehaviorSubject(null);
  outcode$: BehaviorSubject<OutcodeDoc[]> = new BehaviorSubject(null);
  startTime = null;
  endTime = null;
  location: any;

  constructor(private afs: AngularFirestore) {
    this.startTime = new Date().valueOf();
    const outtexts = OUTTEXTs.split('_');
    const outcodes = OUTCODEs.split('_')
      .map(o => {
        const [d, la, ln, s, p, t, r, l] = o
          .replace('!', '|||||')
          .replace(';', '||||')
          .replace(':', '|||')
          .replace('.', '||')
          .split('|');
        // const [d, la, ln, s, p, t, r, l] = o.split('|');
        let rtn: any = { out: d, lng: (-783 + parseInt(ln, 10)) / 100, lat: (4918 + parseInt(la, 10)) / 100 };
        if (s && outtexts[parseInt(d, 36)]) rtn = { ...rtn, ...{ out: outtexts[parseInt(d, 36)] } };
        if (s && outtexts[parseInt(s, 36)]) rtn = { ...rtn, ...{ sector: outtexts[parseInt(s, 36)] } };
        if (p && outtexts[parseInt(p, 36)]) rtn = { ...rtn, ...{ place: outtexts[parseInt(p, 36)] } };
        if (t && outtexts[parseInt(t, 36)]) rtn = { ...rtn, ...{ town: outtexts[parseInt(t, 36)] } };
        if (r && outtexts[parseInt(r, 36)]) rtn = { ...rtn, ...{ region: outtexts[parseInt(r, 36)] } };
        if (l && outtexts[parseInt(l, 36)]) rtn = { ...rtn, ...{ label: outtexts[parseInt(l, 36)] } };
        return rtn;
      })
      .sort((a, b) => b.out.length - a.out.length);
    this.outcode$.next(outcodes);
    console.log('load time' + (new Date().valueOf() - this.startTime));

    this.afs
      .collection('venue')
      .valueChanges()
      .subscribe((venues: VenueDoc[]) => {
        this.endTime = new Date().valueOf();
        this.venue$.next(venues);
      });
    const processTags = combineLatest(this.venue$, this.outcode$, this.filter$)
      .pipe(
        tap(([venues, outs, query]) => {
          console.log(query);
          const startTime = new Date().valueOf();
          try {
            if (venues && venues.length > 0) {
              let matchName, matchOutcode;
              if (query && (query.text || query.text !== '')) {
                if (query.type === 'all' || query.type === 'name')
                  matchName = {
                    heading: 'Venues',
                    tags: this.searchVenuesByName(venues, 'name', query.text, false)
                  };
                matchOutcode = this.searchVenuesByDistancefromOutcodesQueryText(venues, query.maxDistance ? query.maxDistance : 25, outs, query.text);
                const matched = [...matchOutcode, matchName];
                if (query.selected && query.selected.tag) {
                }
                this.match$.next(matched);
                const finishTime = new Date().valueOf();
              }
            }
          } catch (err) {
            console.log(err);
            console.assert(true);
          }
        })
      )
      .subscribe();
  }
  getCriteria() {
    return this.filter$;
  }
  filterText(filterValue: string | SearchResult) {
    const qry = filterValue && typeof filterValue === 'string' ? { type: 'all', text: filterValue } : filterValue && filterValue['text'] ? { type: 'all', text: filterValue['text'], selected: filterValue } : { type: 'all', text: '' };
    if (qry && qry.text !== '') {
      this._filter = { ...this._filter, ...qry };
      this.filter$.next(this._filter);
    } else {
      this.match$.next(null);
      this.filter$.next(null);
    }
  }
  filterDistance(maxDistance: number) {
    this._filter = { ...this._filter, maxDistance };
    this.filter$.next(this._filter);
  }
  filterMinPrice(minPrice: number) {
    this._filter = { ...this._filter, minPrice };
    this.filter$.next(this._filter);
  }
  filterMaxPrice(maxPrice: number) {
    this._filter = { ...this._filter, maxPrice };
    this.filter$.next(this._filter);
  }
  filterMinNights(minNights: number) {
    this._filter = { ...this._filter, minNights };
    this.filter$.next(this._filter);
  }
  filterMaxNights(maxNights: number) {
    this._filter = { ...this._filter, maxNights };
    this.filter$.next(this._filter);
  }
  filterMinPeople(minPeople: number) {
    this._filter = { ...this._filter, minPeople };
    this.filter$.next(this._filter);
  }
  filterMaxPeople(maxPeople: number) {
    this._filter = { ...this._filter, maxPeople };
    this.filter$.next(this._filter);
  }
  getMatches(): Observable<any> {
    return this.match$;
  }
  searchVenuesByName(venues, field, text, compact: boolean = true) {
    text = text ? text : '';
    const rtn = _.groupBy(
      venues
        .filter(v => {
          if (!v || !v[field] || typeof v[field] !== 'string') return false;
          if (v[field].toLowerCase().indexOf(text.toLowerCase()) === 0) {
            return true;
          }
        })
        .map(v => {
          return { value: v[field], id: v['id'], rating: v['rate'], venue: v };
        }),
      v => v.value
    );
    const keys = Object.keys(rtn);
    return keys
      .reduce(
        (acc, key) =>
          !compact || rtn[key].length > 1
            ? [
                ...acc,
                {
                  text,
                  type: field,
                  tag: key,
                  count: rtn[key].length,
                  rating: rtn[key][0].rating,
                  venues: rtn[key].map(v => v.venue)
                }
              ]
            : acc,
        []
      )
      .sort(function(tag1, tag2) {
        if (tag1.count > tag2.count) return -1;
        if (tag1.count < tag2.count) return 1;
        if (tag1.tag > tag2.tag) return 1;
        if (tag1.tag < tag2.tag) return -1;
      });
  }
  searchVenuesByDistancefromOutcodesQueryText(venues, distance, outcodes, text) {
    console.log(text);
    const searchText = typeof text === 'string' ? text.toUpperCase() : '';
    const searchOut3 = searchText.slice(0, 3);
    const searchOut4 = searchText.slice(0, 4);
    const searchLen = searchText.length;
    const fields = [
      {
        key: 'region',
        active: searchLen > 1 && searchLen < 6,
        heading: '',
        tags: []
      },
      {
        key: 'sector',
        active: searchLen < 5,
        heading: '',
        tags: []
      },
      {
        key: 'out',
        active: searchLen === 2 || searchLen === 3 || searchLen === 4,
        heading: '',
        tags: []
      },
      {
        key: 'place',
        active: searchLen > 2,
        heading: '',
        tags: []
      },
      {
        key: 'town',
        active: searchLen > 2,
        heading: '',
        tags: []
      }
    ].filter(field => field.active);
    let add3LetterOutcodes = true;
    for (let outIdx = 0; outIdx < outcodes.length; outIdx++) {
      const outcode = outcodes[outIdx];
      let addCode = false;
      const matchWith = {
        out: false,
        sector: false,
        place: false,
        town: false,
        region: false,
        label: false
      };
      for (let fldIndex = 0; fldIndex < fields.length; fldIndex++) {
        const field = fields[fldIndex];
        if (outcode[field.key]) {
          const fieldValue: string = outcode[field.key] ? outcode[field.key] : '';
          if (field.key !== 'out') {
            if (fieldValue.toUpperCase().indexOf(searchText) === 0) {
              addCode = true;
              matchWith[field.key] = true;
            }
          }
          if (field.key === 'label') {
            if (fieldValue.toUpperCase().indexOf(searchText) === 0 || fieldValue.toUpperCase().indexOf(', ' + searchText) > -1) {
              addCode = true;
              matchWith[field.key] = true;
            }
          } else {
            if (outcode[field.key].length !== 4 && fieldValue.indexOf(searchText) === 0) {
              addCode = true;
              add3LetterOutcodes = false;
              matchWith[field.key] = true;
            } else if ((add3LetterOutcodes && searchLen === 4 && fieldValue === searchOut4) || (add3LetterOutcodes && searchLen === 3 && fieldValue.indexOf(searchOut3) === 0) || (add3LetterOutcodes && searchLen === 4 && (fieldValue + ' ').indexOf(searchOut3 + ' ') === 0)) {
              addCode = true;
              matchWith[field.key] = true;
            }
          }
        }
      }
      if (searchLen === 0 && outcode.region) {
        addCode = true;
        matchWith.sector = true;
      }
      if (addCode) {
        const venueDistances = venues
          .map(v => ({
            ...v,
            distance: getDistanceInMiles(v.lat, v.lng, outcode.lat, outcode.lng)
          }))
          .sort((v1, v2) => v1.distance - v2.distance);
        const filteredVenues = venueDistances.filter(v => v.distance < distance);
        if (filteredVenues.length > 0) {
          fields.forEach(field => {
            if (matchWith[field.key]) {
              try {
                field.tags = [
                  ...field.tags,
                  {
                    text,
                    tag: outcode[field.key] + (field.key === 'sector' && outcode.place ? ' : ' + outcode.place : '') + (field.key === 'out' && outcode.town ? ' : ' + outcode.town : '') + (field.key === 'out' && outcode.label ? ' : ' + outcode.label : ''),
                    type: field.key,
                    count: filteredVenues.length,
                    near: filteredVenues[0].distance,
                    venues: filteredVenues
                  }
                ];
              } catch (err) {
                console.log(err);
              }
            }
          });
        }
      }
    }

    return fields.reduce((searchResults, searchResult) => {
      if (searchResult.tags.length > 0) {
        return [
          ...searchResults,
          {
            heading: searchResults.length === 0 ? 'Places' : searchResult.heading,
            tags: searchResult.tags.slice(0, searchResult.tags.length > 50 ? 50 : searchResult.tags.length).sort(function(tag1, tag2) {
              if (tag1.count > tag2.count) return -1;
              if (tag1.count < tag2.count) return 1;
              if (tag1.tag > tag2.tag) return 1;
              if (tag1.tag < tag2.tag) return -1;
            })
          }
        ];
      }
      return searchResults;
    }, []);
  }
}

@Injectable({
  providedIn: 'root'
})
export class Search2Service {
  private Criteria$: BehaviorSubject<any> = new BehaviorSubject(null);

  private searchText$: BehaviorSubject<string> = new BehaviorSubject(null);
  private searchSelected$: BehaviorSubject<any> = new BehaviorSubject(null);
  private searchSelection$: BehaviorSubject<any> = new BehaviorSubject(null);
  private maxDistance$: BehaviorSubject<number> = new BehaviorSubject(null);
  private minPrice$: BehaviorSubject<number> = new BehaviorSubject(null);
  private maxPrice$: BehaviorSubject<number> = new BehaviorSubject(null);
  private minNights$: BehaviorSubject<number> = new BehaviorSubject(null);
  private maxNights$: BehaviorSubject<number> = new BehaviorSubject(null);
  private minPeople$: BehaviorSubject<number> = new BehaviorSubject(null);
  private maxPeople$: BehaviorSubject<number> = new BehaviorSubject(null);
  startTime = null;
  endTime = null;

  private allVenue$: BehaviorSubject<VenueDoc[]> = new BehaviorSubject(null);
  private allOutcode$: BehaviorSubject<Outcode2Doc[]> = new BehaviorSubject(null);

  private filteredVenueByPackage$: BehaviorSubject<VenueDoc[]> = new BehaviorSubject(null);
  private filteredVenueByText$: BehaviorSubject<VenueDoc[]> = new BehaviorSubject(null);
  private filteredOutcodeByText$: BehaviorSubject<OutcodeDoc[]> = new BehaviorSubject(null);
  private filteredOutcodeByTextDistance$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private afs: AngularFirestore) {
    console.clear();
    this.startTime = new Date().valueOf();
    const outtexts = OUTTEXTs.split('_');
    const outcodes = OUTCODEs.split('_')
      .map(o => {
        const [d, la, ln, s, p, t, r, l] = o
          .replace('!', '|||||')
          .replace(';', '||||')
          .replace(':', '|||')
          .replace('.', '||')
          .split('|');
        // const [d, la, ln, s, p, t, r, l] = o.split('|');
        let rtn: any = { out: d, lng: (-783 + parseInt(ln, 10)) / 100, lat: (4918 + parseInt(la, 10)) / 100 };
        if (s && outtexts[parseInt(d, 36)]) rtn = { ...rtn, ...{ out: outtexts[parseInt(d, 36)] } };
        if (s && outtexts[parseInt(s, 36)]) rtn = { ...rtn, ...{ sector: outtexts[parseInt(s, 36)] } };
        if (p && outtexts[parseInt(p, 36)]) rtn = { ...rtn, ...{ place: outtexts[parseInt(p, 36)] } };
        if (t && outtexts[parseInt(t, 36)]) rtn = { ...rtn, ...{ town: outtexts[parseInt(t, 36)] } };
        if (r && outtexts[parseInt(r, 36)]) rtn = { ...rtn, ...{ region: outtexts[parseInt(r, 36)] } };
        if (l && outtexts[parseInt(l, 36)]) rtn = { ...rtn, ...{ label: outtexts[parseInt(l, 36)] } };
        return rtn;
      })
      .sort((a, b) => b.out.length - a.out.length);
    const outcodesWithQuickVenueDistances = outcodes.map(outcode => {
      const venueDistances = VENUE_LOCATIONS.reduce((accVenues, venue) => {
        const distance = Math.abs(Math.abs(venue.lat) - Math.abs(outcode.lat)) < 0.73 && Math.abs(Math.abs(venue.lng) - Math.abs(outcode.lng)) < 1.38 ? getDistanceInMiles(venue.lat, venue.lng, outcode.lat, outcode.lng) : 999;
        return distance < 50 ? [...accVenues, { id: venue.id, distance }] : accVenues;
      }, []).sort((v1, v2) => v1.distance - v2.distance);
      return { ...outcode, venuesIn50: venueDistances };
    });
    console.log('quick venues time' + (new Date().valueOf() - this.startTime));
    // let index = 0;
    // let last = -1;
    // const secondsCounter = interval(300);
    // // Subscribe to begin publishing values
    // secondsCounter.subscribe(n => {
    //   if (index < VENUE_LOCATIONS.length && index > last) {
    //     last = index;
    //     const v = VENUE_LOCATIONS[index];
    //     const id = v.id;
    //     this.afs
    //       .doc(`venue_location/${id}`)
    //       .set(v)
    //       .then(() => (index = index + 1))
    //       .catch(() => (index = index + 1));
    //   }
    // });
    this.startTime = new Date().valueOf();
    this.afs
      .collection('venue')
      .valueChanges()
      .subscribe((venues: VenueDoc[]) => {
        // const venuelocations = venues.map(v => {
        //   return { id: v.id, lng: Math.round(v.lng * 1000) / 1000, lat: Math.round(v.lat * 1000) / 1000 };
        // });
        // console.log(JSON.stringify(venuelocations));
        console.log('load venues time' + (new Date().valueOf() - this.startTime));
        const outcodesWithVenueDistances = outcodes.map(outcode => {
          const venueDistances = venues
            .reduce((accVenues, venue) => {
              const distance = Math.abs(Math.abs(venue.lat) - Math.abs(outcode.lat)) < 0.73 && Math.abs(Math.abs(venue.lng) - Math.abs(outcode.lng)) < 1.38 ? getDistanceInMiles(venue.lat, venue.lng, outcode.lat, outcode.lng) : 999;
              return distance < 50 ? [...accVenues, { id: venue.id, distance }] : accVenues;
            }, [])
            .sort((v1, v2) => v1.distance - v2.distance);
          return { ...outcode, venuesIn50: venueDistances };
        });
        this.allOutcode$.next(outcodesWithVenueDistances);
        this.allVenue$.next(venues);
        this.Watchers();
        this.Distance(50);
        console.log('load outcode distance time' + (new Date().valueOf() - this.startTime));
      });
  }
  Watchers() {
    const processPricePeopleNights = combineLatest(this.allVenue$, this.minPrice$, this.minPeople$, this.minNights$, this.maxPrice$, this.maxPeople$, this.maxNights$)
      .pipe(
        tap(([allVenues, minPrice, minPeople, minNights, maxPrice, maxPeople, maxNights]) => {
          const startTime = new Date().valueOf();
          try {
            const filteredVenues = allVenues
              .map(venue => {
                let filteredPacks = venue.pcks.sort((a, b) => parseFloat(a.fromPrice) - parseFloat(b.fromPrice));
                if (typeof minPrice === 'number' && minPrice > 0) filteredPacks = filteredPacks.filter(pack => (parseFloat(pack.toPrice) && parseFloat(pack.toPrice) >= minPrice ? true : false));
                if (typeof maxPrice === 'number' && maxPrice < 9999) filteredPacks = filteredPacks.filter(pack => (parseFloat(pack.fromPrice) && parseFloat(pack.fromPrice) <= maxPrice ? true : false));
                if (typeof minNights === 'number' && minNights > 0) filteredPacks = filteredPacks.filter(pack => (pack.nights >= minNights ? true : false));
                if (typeof maxNights === 'number' && maxNights < 99) filteredPacks = filteredPacks.filter(pack => (pack.nights <= maxNights ? true : false));
                if (typeof minPeople === 'number' && minPeople > 0) filteredPacks = filteredPacks.filter(pack => (pack.people >= minPeople ? true : false));
                if (typeof maxPeople === 'number' && maxPeople < 99) filteredPacks = filteredPacks.filter(pack => (pack.people <= maxPeople ? true : false));
                return { ...venue, availablepcks: filteredPacks, daypcks: filteredPacks.filter(p => p.nights === 0), breakpcks: filteredPacks.filter(p => p.nights > 0) };
              })
              .filter(v => v.availablepcks.length > 0);
            this.filteredVenueByPackage$.next(filteredVenues);
          } catch (err) {
            console.log(err);
            console.assert(true);
          }
          console.log('venue text filter time' + (new Date().valueOf() - startTime));
        })
      )
      .subscribe();

    const processSearchTextVenues = combineLatest(this.allVenue$, this.searchText$)
      .pipe(
        tap(([filteredVenuesByPackage, text]) => {
          const startTime = new Date().valueOf();
          try {
            const filteredVenues = filteredVenuesByPackage.filter(v => {
              if (!v || !v.name || typeof v.name !== 'string') return false;
              if (v.name.toLowerCase().indexOf(text.toLowerCase()) === 0) {
                return true;
              }
            });
            this.filteredVenueByText$.next(filteredVenues);
          } catch (err) {
            console.log(err);
            console.assert(true);
          }
          console.log('venue text filter time' + (new Date().valueOf() - startTime));
        })
      )
      .subscribe();

    const processSearchTextOutcodes = combineLatest(this.allOutcode$, this.searchText$)
      .pipe(
        tap(([allOutcodes, text]) => {
          const startTime = new Date().valueOf();
          const searchText = typeof text === 'string' ? text.toUpperCase() : '';
          const searchOut3 = searchText.slice(0, 3);
          const searchOut4 = searchText.slice(0, 4);
          const searchLen = searchText.length;
          const fields = [
            {
              key: 'region',
              active: searchLen < 6,
              tags: []
            },
            {
              key: 'sector',
              active: searchLen > 1 && searchLen < 5,
              tags: []
            },
            {
              key: 'out',
              active: searchLen === 2 || searchLen === 3 || searchLen === 4,
              tags: []
            },
            {
              key: 'place',
              active: searchLen > 2,
              tags: []
            },
            {
              key: 'town',
              active: searchLen > 2,
              tags: []
            }
          ].filter(field => field.active);
          try {
            let add3LetterOutcodes = true;
            const filteredOutcodes = allOutcodes.reduce((accOutcodes, outcode) => {
              let addCode = false;
              const matches = {
                out: false,
                sector: false,
                place: false,
                town: false,
                region: false
              };
              for (let fldIndex = 0; fldIndex < fields.length; fldIndex++) {
                const field = fields[fldIndex];
                if (outcode[field.key]) {
                  const fieldValue: string = outcode[field.key] ? outcode[field.key] : '';
                  if (field.key !== 'out') {
                    if (fieldValue.toUpperCase().indexOf(searchText) === 0) {
                      addCode = true;
                      matches[field.key] = true;
                    }
                  }
                  if (field.key === 'label') {
                    if (fieldValue.toUpperCase().indexOf(searchText) === 0 || fieldValue.toUpperCase().indexOf(', ' + searchText) > -1) {
                      addCode = true;
                      matches[field.key] = true;
                    }
                  } else {
                    if (outcode[field.key].length !== 4 && fieldValue.indexOf(searchText) === 0) {
                      addCode = true;
                      add3LetterOutcodes = false;
                      matches[field.key] = true;
                    } else if ((add3LetterOutcodes && searchLen === 4 && fieldValue === searchOut4) || (add3LetterOutcodes && searchLen === 3 && fieldValue.indexOf(searchOut3) === 0) || (add3LetterOutcodes && searchLen === 4 && (fieldValue + ' ').indexOf(searchOut3 + ' ') === 0)) {
                      addCode = true;
                      matches[field.key] = true;
                    }
                  }
                }
              }
              return addCode ? [...accOutcodes, { ...outcode, match: matches }] : accOutcodes;
            }, []);
            this.filteredOutcodeByText$.next(filteredOutcodes);
          } catch (err) {
            console.log(err);
            console.assert(true);
          }
          console.log('outcode text filter time' + (new Date().valueOf() - startTime));
        })
      )
      .subscribe();

    const processMaxDistance = combineLatest(this.filteredVenueByPackage$, this.filteredOutcodeByText$, this.maxDistance$, this.searchSelected$)
      .pipe(
        tap(([allVenues, filteredOutcodes, maxDistance, searchSelected]) => {
          if (filteredOutcodes && filteredOutcodes.length > 0 && maxDistance && maxDistance < 51) {
            const startTime = new Date().valueOf();
            const fields = [
              {
                key: 'region'
              },
              {
                key: 'sector'
              },
              {
                key: 'out'
              },
              {
                key: 'place'
              },
              {
                key: 'town'
              }
            ];
            try {
              const filteredDistanceOutcodes = filteredOutcodes
                .reduce((accOutcodes, filteredOutcode: Outcode2Doc) => {
                  const venueDistances = filteredOutcode.venuesIn50.filter(v => v.distance <= (maxDistance ? maxDistance : 25));
                  if (!(venueDistances && venueDistances.length && venueDistances.length > 0)) {
                    return accOutcodes;
                  } else {
                    let rtn = [];
                    const venueDetailDistance = venueDistances.reduce((accVenues, venueDistance) => {
                      const venueDetail = allVenues.find(venue => venue.id === venueDistance.id);
                      return venueDetail !== undefined ? [...accVenues, { ...venueDistance, ...venueDetail }] : accVenues;
                    }, []);
                    fields.forEach(field => {
                      if (filteredOutcode['match'] && filteredOutcode['match'][field.key]) {
                        try {
                          const updatedOutcode = {
                            tag: filteredOutcode[field.key] + (field.key === 'sector' && filteredOutcode.place ? ' : ' + filteredOutcode.place : '') + (field.key === 'out' && filteredOutcode.town ? ' : ' + filteredOutcode.town : '') + (field.key === 'out' && filteredOutcode.label ? ' : ' + filteredOutcode.label : ''),
                            type: field.key,
                            count: venueDetailDistance.length,
                            near: venueDetailDistance[0].distance,
                            venues: venueDetailDistance
                          };

                          rtn = [...rtn, updatedOutcode];
                          if (searchSelected && searchSelected.tag && searchSelected.tag === updatedOutcode.tag && searchSelected.type === field.key) {
                            this.searchSelection$.next(updatedOutcode);
                          }
                        } catch (err) {
                          console.log(err);
                        }
                      }
                    });

                    return [...accOutcodes, ...rtn];
                  }
                }, [])
                .sort(function(tag1, tag2) {
                  if (tag1.count > tag2.count) return -1;
                  if (tag1.count < tag2.count) return 1;
                  if (tag1.tag > tag2.tag) return 1;
                  if (tag1.tag < tag2.tag) return -1;
                });
              this.filteredOutcodeByTextDistance$.next(filteredDistanceOutcodes);
            } catch (err) {
              console.log(err);
              console.assert(true);
            }
            console.log('max distance time ' + (new Date().valueOf() - startTime));
          }
        })
      )
      .subscribe();
    const processCriteria = combineLatest(this.searchText$, this.maxDistance$, this.minPrice$, this.minPeople$, this.minNights$, this.maxPrice$, this.maxPeople$, this.maxNights$)
      .pipe(
        tap(([searchText, maxDistance, minPrice, minPeople, minNights, maxPrice, maxPeople, maxNights]) => {
          const startTime = new Date().valueOf();
          try {
            let criteria = {
              searchText: '',
              maxDistance: 50,
              minPrice: 0,
              maxPrice: 9999,
              minNights: 0,
              maxNights: 99,
              minPeople: 0,
              maxPeople: 99
            };
            if (searchText !== undefined && typeof searchText === 'string' && searchText !== '') criteria = { ...criteria, searchText };
            if (maxDistance !== undefined && typeof maxDistance === 'number' && maxDistance > 0) criteria = { ...criteria, maxDistance };
            if (minPrice !== undefined && typeof minPrice === 'number' && minPrice > 0) criteria = { ...criteria, minPrice };
            if (maxPrice !== undefined && typeof maxPrice === 'number' && maxPrice < 9999) criteria = { ...criteria, maxPrice };
            if (minNights !== undefined && typeof minNights === 'number' && minNights >= 0) criteria = { ...criteria, minNights };
            if (maxNights !== undefined && typeof maxNights === 'number' && maxNights <= 99) criteria = { ...criteria, maxNights };
            if (minPeople !== undefined && typeof minPeople === 'number' && minPeople >= 0) criteria = { ...criteria, minPeople };
            if (maxPeople !== undefined && typeof maxPeople === 'number' && maxPeople <= 99) criteria = { ...criteria, maxPeople };
            this.Criteria$.next(criteria);
          } catch (err) {
            console.log(err);
            console.assert(true);
          }
          console.log('max distance time ' + (new Date().valueOf() - startTime));
        })
      )
      .subscribe();
  }
  Text(value: string) {
    this.searchText$.next(value);
    if (!value || value === '') {
      this.searchSelected$.next(null);
      this.searchSelection$.next(null);
    }
  }
  Distance(value: number) {
    this.maxDistance$.next(value);
  }
  MinPrice(value: number) {
    this.minPrice$.next(value);
  }
  MaxPrice(value: number) {
    this.maxPrice$.next(value);
  }
  MinNights(value: number) {
    this.minNights$.next(value);
  }
  MaxNights(value: number) {
    this.maxNights$.next(value);
  }
  MinPeople(value: number) {
    this.minPeople$.next(value);
  }
  MaxPeople(value: number) {
    this.maxPeople$.next(value);
  }
  Select(value: SearchResult) {
    this.searchSelected$.next(value);
    this.searchSelection$.next(value);
  }
  Criteria() {
    return this.Criteria$;
  }
  Selection() {
    return this.searchSelection$;
  }
  AutoCompleteLocations() {
    return this.filteredOutcodeByTextDistance$;
  }
  AutoCompleteVenues() {
    return this.filteredVenueByText$;
  }
}
