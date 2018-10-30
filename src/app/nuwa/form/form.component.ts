import { Component, OnInit, Input } from '@angular/core';
import { NuwaFormField } from '../models/nuwa.form.field';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nuwa-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class NuwaFormComponent implements OnInit {
  @Input()
  base: any;
  @Input()
  definition: NuwaFormField;
  @Input()
  entity: any;

  constructor() {}

  ngOnInit() {}
}
