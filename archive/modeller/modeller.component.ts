import { Component, OnInit } from '@angular/core';
import {
  DynamicFormControlModel,
  DynamicFormService,
  DynamicFormControlEvent,
  DynamicCheckboxModel,
  DynamicCheckboxGroupModel,
  DynamicColorPickerModel,
  DynamicDatePickerModel,
  DynamicEditorModel,
  DynamicFileUploadModel,
  DynamicFormGroupModel,
  DynamicInputModel,
  DynamicRadioGroupModel,
  DynamicRatingModel,
  DynamicSelectModel,
  DynamicSliderModel,
  DynamicSwitchModel,
  DynamicTextAreaModel,
  DynamicTimePickerModel
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { MODELLER_FORM } from './modeller.model';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-modeller',
  templateUrl: './modeller.component.html',
  styleUrls: ['./modeller.component.scss']
})
export class ModellerComponent implements OnInit {
  formModel: DynamicFormControlModel[];
  formGroup: FormGroup;
  // editors: Editor[];
  // editor: Editor;

  constructor(
    private afs: AngularFirestore,
    private formService: DynamicFormService
  ) {}

  ngOnInit() {
    this.formModel = MODELLER_FORM;
    this.formGroup = this.formService.createFormGroup(MODELLER_FORM);
    // const editor$ = this.afs
    //   .collection('editors')
    //   .valueChanges()
    //   .subscribe((editors: Editor[]) => {
    //     this.editors = editors;
    //   });
  }

  onChange(ev: DynamicFormControlEvent) {
    debugger;
    if (ev.model.id === 'fieldType') {
      ev.group.controls['fieldDefault'].setValue(
        {
          string: ' ',
          number: 0,
          boolean: false,
          object: { field: '' },
          array: [],
          date: new Date(),
          time: new Date(),
          geopoint: { longitude: 0, latitude: 0 },
          reference: '',
          file: null
        }[ev.$event.value]
      );
    }
  }
  // selectEditor(editor: Editor) {
  //   this.editor = editor;
  //   this.formModel = this.formService.fromJSON(editor.editorModel);
  //   this.formGroup = this.formService.createFormGroup(MODELLER_FORM);
  // }

  // selectControlType(ev: MatSelectChange) {
  //   const layout = null;
  //   const model = { id: '' + new Date().valueOf().toString(16) };
  //   switch (ev.value) {
  //     case 'CHECKBOX':
  //       this.formModel.push(new DynamicCheckboxModel(model, layout));
  //       break;

  //     case 'CHECKBOX_GROUP':
  //       this.formModel.push(new DynamicCheckboxGroupModel(model, layout));
  //       break;

  //     case 'COLORPICKER':
  //       this.formModel.push(new DynamicColorPickerModel(model, layout));
  //       break;

  //     case 'DATEPICKER':
  //       this.formModel.push(new DynamicDatePickerModel(model, layout));
  //       break;

  //     case 'EDITOR':
  //       this.formModel.push(new DynamicEditorModel(model, layout));
  //       break;

  //     case 'FILE_UPLOAD':
  //       this.formModel.push(new DynamicFileUploadModel(model, layout));
  //       break;

  //     case 'GROUP':
  //       // model.group = this.fromJSON(model.group);
  //       this.formModel.push(new DynamicFormGroupModel(model, layout));
  //       break;

  //     case 'INPUT':
  //       // let inputModel = model as DynamicInputModel;

  //       // if (inputModel.mask !== null) {
  //       //   inputModel.mask = JSONUtils.maskFromString(inputModel.mask as string);
  //       // }

  //       this.formModel.push(new DynamicInputModel(model, layout));
  //       break;

  //     case 'RADIO_GROUP':
  //       this.formModel.push(new DynamicRadioGroupModel(model, layout));
  //       break;

  //     case 'RATING':
  //       this.formModel.push(new DynamicRatingModel(model, layout));
  //       break;

  //     case 'SELECT':
  //       this.formModel.push(new DynamicSelectModel(model, layout));
  //       break;

  //     case 'SLIDER':
  //       this.formModel.push(new DynamicSliderModel(model, layout));
  //       break;

  //     case 'SWITCH':
  //       this.formModel.push(new DynamicSwitchModel(model, layout));
  //       break;

  //     case 'TEXTAREA':
  //       this.formModel.push(new DynamicTextAreaModel(model, layout));
  //       break;

  //     case 'TIMEPICKER':
  //       this.formModel.push(new DynamicTimePickerModel(model, layout));
  //       break;
  //   }
  //   this.formGroup = this.formService.createFormGroup(this.formModel);
  // }
}
