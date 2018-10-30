import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { PlaceDetail } from './locations';
import { VenuesDoc } from './venues';
import { HttpClient } from '@angular/common/http';
import { slugify } from '../../functions/slugify';
import * as _ from 'lodash';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss']
})
export class VenuesComponent implements OnInit {
  locations = null;
  index = -1;
  last = -1;
  packages: {}[];
  outcodes: {}[];
  processLength: number;

  constructor(private afs: AngularFirestore, private http: HttpClient) {
    this.afs
      .collection('packages')
      .valueChanges()
      .subscribe(packages => {
        this.packages = packages;
        this.http.get('../../../assets/locations.json').subscribe(locations => {
          this.locations = locations;
        });
      });
  }
  ngOnInit() {}

  previewLocation(location: PlaceDetail) {
    let street, town, region, country, postcode;

    try {
      street = location.address_components.filter(comp =>
        comp.types.includes('route')
      );
      town = location.address_components.filter(comp =>
        comp.types.includes('postal_town')
      );
      region = location.address_components.filter(comp =>
        comp.types.includes('administrative_area_level_2')
      );
      country = location.address_components.filter(comp =>
        comp.types.includes('administrative_area_level_1')
      );
      postcode = location.address_components.filter(comp =>
        comp.types.includes('postal_code')
      );

      const venue = {
        street: street[0] ? street[0].long_name : '',
        town: town[0] ? town[0].long_name : '',
        region: region[0] ? region[0].long_name : '',
        country: country[0] ? country[0].long_name : '',
        postcode: postcode[0] ? postcode[0].long_name : '',
        address: location.formatted_address ? location.formatted_address : '',
        phone: location.formatted_phone_number
          ? location.formatted_phone_number
          : '',
        lng: location.geometry.location.lng,
        lat: location.geometry.location.lat,
        name: location.name,
        rate: location.rating ? location.rating : 0,
        map: location.url ? location.url : '',
        web: location.website ? location.website : ''
      };
      return venue;
    } catch (err) {
      console.log(location.address_components);
    }
  }
  processLocations() {
    if (this.index === -1) {
      this.processLength = this.locations.length;
      this.index = 0;
      const secondsCounter = interval(300);
      // Subscribe to begin publishing values
      secondsCounter.subscribe(n => {
        if (this.index < this.locations.length && this.index > this.last) {
          this.last = this.index;
          const venue = this.previewLocation(this.locations[this.index]);
          const id = this.locations[this.index].place_id;
          this.afs
            .doc(`venues/${id}`)
            .valueChanges()
            .subscribe((v: VenuesDoc) => {
              if (
                v &&
                v.venue_location &&
                v.venue_location.name &&
                v.venue_location.postcode
              ) {
                const dashed =
                  v && v.venue_name
                    ? v.venue_name
                    : slugify(
                        v.venue_location.name + ' ' + v.venue_location.postcode
                      );
                try {
                  console.log(dashed);

                  const packages = this.packages.filter(
                    pack => pack['venue_id'] === v.venue_id
                  );

                  const pcks = packages.reduce((acc: any[], p) => {
                    const pk = {
                      id: p['id'],
                      nights: p['number_of_nights'],
                      people: p['number_of_people'],
                      avail: _.uniq(
                        _.flattenDeep(
                          p['products'].reduce(
                            (prs, pr) => [...prs, pr['days_available']],
                            []
                          )
                        )
                      ),
                      fromPrice: _.min(
                        p['products'].reduce(
                          (prs, pr) => [...prs, pr['price']],
                          []
                        )
                      ),
                      toPrice: _.min(
                        p['products'].reduce(
                          (prs, pr) => [...prs, pr['price']],
                          []
                        )
                      ),
                      fromDate: _.min(
                        p['products'].reduce(
                          (prs, pr) => [...prs, pr['start_date']],
                          []
                        )
                      ),
                      toDate: _.min(
                        p['products'].reduce(
                          (prs, pr) => [...prs, pr['end_date']],
                          []
                        )
                      )
                    };
                    const include =
                      pk.fromDate <= '2019-09-01' && pk.toDate > '2018-09-01';
                    return include ? [...acc, pk] : acc;
                  }, []);
                  this.afs
                    .doc(`venue/${id}`)
                    .set({
                      id,
                      ...venue,
                      dash: dashed,
                      img: v.venue_image,
                      sbid: v.venue_id,
                      pcks
                    })
                    .then(() => {
                      // this.afs
                      //   .doc(`venue_content/${id}`)
                      //   .set({
                      //     info: v.venue_info,
                      //     high: v.venue_detail,
                      //     imgs: v.venue_images
                      //   })
                      //   .then(() => {
                      this.index = this.index + 1;
                      // });
                    });
                } catch (err) {}
              } else {
                this.index = this.index + 1;
              }
            });
        }
      });
    }
  }
  // processOutcodes() {
  //   const outcodes = OUTCODES;
  //   let writes = [];

  //   for (let index = 0; index < outcodes.length; index++) {
  //     const out = outcodes[index].o;
  //     const sector = outcodes[index].s
  //       ? outcodes[index].s
  //       : undefined;
  //     const place = outcodes[index].p
  //       ? outcodes[index].p
  //       : undefined;
  //     const town = outcodes[index].t
  //       ? outcodes[index].t
  //       : undefined;
  //     const region = outcodes[index].r
  //       ? outcodes[index].r
  //       : undefined;
  //     const area = outcodes[index].a
  //       ? outcodes[index].a
  //       : undefined;
  //     const lng = outcodes[index].ln;
  //     const lat = outcodes[index].la;
  //     let data = {};
  //     data = {
  //       out, lng, lat
  //     };
  //     data = region === undefined ? data : { ...data, region };
  //     data = sector === undefined ? data : { ...data, sector };
  //     data = place === undefined ? data : { ...data, place };
  //     data = area === undefined ? data : { ...data, area };
  //     data = town === undefined ? data : { ...data, town };

  //     writes = [...writes, { path: `outcodes/${out}`, data }];
  //   }

  //   this.processLength = writes.length;
  //   if (this.index === -1) {
  //     this.index = 0;
  //     const secondsCounter = interval(300);
  //     // Subscribe to begin publishing values
  //     secondsCounter.subscribe(n => {

  //   if (this.index < writes.length && this.index > this.last) {
  //         this.last = this.index;
  //         this.afs
  //           .doc(writes[this.index].path)
  //           .set(writes[this.index].data)
  //           .then(() => {
  //             this.index = this.index + 1;
  //           });
  //       }
  //     });
  //   }
  // }
}
