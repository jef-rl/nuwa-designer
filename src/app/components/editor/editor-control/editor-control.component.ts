import { EditorControl } from './../../../models/editor-control';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editor-control',
  templateUrl: './editor-control.component.html',
  styleUrls: ['./editor-control.component.scss']
})
export class EditorControlComponent {
  @Input()
  editorControl: EditorControl<any>;
  @Input()
  form: FormGroup;
  get isValid() {
    return this.form.controls[this.editorControl.key].valid;
  }
}
