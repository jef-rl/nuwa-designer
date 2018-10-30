import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { SearchFilter } from '../../../services/search.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
@Input() criteria: SearchFilter;
@Output() setPackageType = new EventEmitter<any>();
@Output() setDistance = new EventEmitter<any>();
@Output() setLocation = new EventEmitter<any>();
@Output() setRegion = new EventEmitter<any>();
@Output() setPriceFrom = new EventEmitter<any>();
@Output() setPriceTo = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

}
