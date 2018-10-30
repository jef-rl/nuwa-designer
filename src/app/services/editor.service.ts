import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditorControl } from '../models/editor-control';

@Injectable()
export class EditorControlService {
  constructor() {}

  toFormGroup(editorSchema: EditorControl<any>[]) {
    const group: any = {};

    editorSchema.forEach(editControl => {
      group[editControl.key] = editControl.required
        ? new FormControl(editControl.value || '', Validators.required)
        : new FormControl(editControl.value || '');
    });
    return new FormGroup(group);
  }
}
