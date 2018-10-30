import {
  DynamicCheckboxModel,
  DynamicCheckboxGroupModel,
  DynamicInputModel,
  DynamicRadioGroupModel,
  DynamicSelectModel,
  DynamicTextAreaModel,
  DynamicFormArrayModel,
  DynamicFormGroupModel
} from '@ng-dynamic-forms/core';

export const MODELLER_FORM = [
  new DynamicSelectModel<string>({
    id: 'fieldType',
    label: 'Type',
    options: [
      {
        label: 'String',
        value: 'string'
      },
      {
        label: 'Number',
        value: 'number'
      },
      {
        label: 'Boolean',
        value: 'boolean'
      },
      {
        label: 'Object',
        value: 'object'
      },
      {
        label: 'Array',
        value: 'array'
      },
      {
        label: 'Date',
        value: 'date'
      },
      {
        label: 'Time',
        value: 'time'
      },
      {
        label: 'Geopoint',
        value: 'geopoint'
      },
      {
        label: 'Reference',
        value: 'reference'
      },
      {
        label: 'Storage File',
        value: 'file'
      },
    ],
    value: ''
  }),

  new DynamicInputModel({
    id: 'fieldDefault',
    label: 'Default Value',
    required: true,
    validators: {
      required: null,
    },
    errorMessages: {
      required: '{{label}} is required',
    },
    value: null
  }),

  new DynamicInputModel({
    id: 'fieldName',
    label: 'Name',
    required: true,
    validators: {
      required: null,
      minLength: 2,
      maxLength: 5,
    },
    errorMessages: {
      required: '{{label}} is required',
    },
    value: null
  }),

  new DynamicInputModel({
    id: 'fieldLabel',
    label: 'Placeholder',
    required: true,
    validators: {
      required: null,
      minLength: 2,
      maxLength: 5,
    },
    errorMessages: {
      required: '{{label}} is required',
    },
    value: null
  }),


  // new DynamicCheckboxGroupModel({
  //   id: 'basicCheckboxGroup',
  //   legend: 'Checkbox Group',
  //   group: [
  //     new DynamicCheckboxModel({
  //       id: 'checkboxGroup1',
  //       label: 'Checkbox 1'
  //     }),
  //     new DynamicCheckboxModel({
  //       id: 'checkboxGroup2',
  //       label: 'Checkbox 2'
  //     })
  //   ]
  // }),

  // new DynamicRadioGroupModel<string>({
  //   id: 'basicRadioGroup',
  //   legend: 'Radio Group',
  //   options: [
  //     {
  //       label: 'Option 1',
  //       value: 'option-1'
  //     },
  //     {
  //       disabled: true,
  //       label: 'Option 2',
  //       value: 'option-2'
  //     },
  //     {
  //       label: 'Option 3',
  //       value: 'option-3'
  //     },
  //     {
  //       label: 'Option 4',
  //       value: 'option-4'
  //     }
  //   ],
  //   value: 'option-3'
  // }),

  // new DynamicTextAreaModel({
  //   id: 'basicTextArea',
  //   label: 'Textarea',
  //   rows: 5,
  //   placeholder: 'example Textarea'
  // }),

  // new DynamicFormGroupModel({
  //   id: 'basicFormGroup1',
  //   legend: 'Form Group 1',
  //   group: [
  //     new DynamicInputModel({
  //       id: 'basicGroupInput1-1',
  //       label: 'Nested Input 1-1',
  //       value: 'Test 1-1'
  //     }),
  //     new DynamicInputModel({
  //       id: 'basicGroupInput1-2',
  //       label: 'Nested Input 1-2',
  //       value: 'Test 1-2'
  //     })
  //   ]
  // }),

  // new DynamicFormGroupModel({
  //   id: 'basicFormGroup2',
  //   legend: 'Form Group 2',
  //   group: [
  //     new DynamicInputModel({
  //       id: 'basicGroupInput2-1',
  //       label: 'Nested Input 2-1',
  //       value: 'Test 2-1'
  //     }),
  //     new DynamicInputModel({
  //       id: 'basicGroupInput2-2',
  //       label: 'Nested Input 2-2',
  //       value: 'Test 2-2'
  //     })
  //   ]
  // }),

  // new DynamicCheckboxModel({
  //   id: 'basicCheckbox',
  //   label: 'I do agree'
  // })
];

export const BASIC_SAMPLE_FORM_ARRAY_MODEL = [
  new DynamicFormArrayModel({
    id: 'basicFormArray',
    initialCount: 2,
    label: 'Form Array',
    groupFactory: () => {
      return [
        new DynamicCheckboxModel({
          label: 'Mon',
          id: 'monday'
        }),
        new DynamicCheckboxModel({
          label: 'Tue',
          id: 'tuesday'
        }),
        new DynamicCheckboxModel({
          label: 'Wed',
          id: 'wednesday'
        }),
        new DynamicCheckboxModel({
          label: 'Thu',
          id: 'thursday'
        }),
        new DynamicCheckboxModel({
          label: 'Fri',
          id: 'friday'
        }),
        new DynamicCheckboxModel({
          label: 'Sat',
          id: 'saturday'
        }),
        new DynamicCheckboxModel({
          label: 'Sun',
          id: 'sunday'
        })
      ];
    }
  })
];
