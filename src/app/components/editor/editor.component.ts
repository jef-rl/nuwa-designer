
import { Component, OnInit, Input } from '@angular/core';
import { EditorControlService } from '../../services/editor.service';
import { EditorControl } from '../../models/editor-control';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @Input()
  form: FormGroup;
  payLoad = "";
  schema: EditorControl<any>[];

  constructor(private ecs: EditorControlService) {}

  ngOnInit() {
    this.schema = [
      new EditorControl<string>({
        key: 'brave',
        label: 'Bravery Rating',
        controlType: 'dropdown',
        options: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' }
        ],
        order: 3
      }),
      new EditorControl<string>({
        key: 'firstName',
        label: 'First name',
        controlType: 'textbox',
        value: 'Bombasto',
        required: true,
        order: 1
      }),
      new EditorControl<string>({
        key: 'emailAddress',
        label: 'Email',
        controlType: 'textbox',
        order: 2
      })
    ].sort((a, b) => a.order - b.order);

    this.form = this.ecs.toFormGroup(this.schema);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }
}
