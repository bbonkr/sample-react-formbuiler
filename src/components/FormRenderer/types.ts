import { ElementTypes, FormItemModel } from '../../api';

export const elementTypes = [
    'SingleLineText',
    'Date',
    'Datetime',
    'Time',
    'Email',
    'NumberInteger',
    'NumberFloat',
    'Select',
    'MultiLineText',
    'Checkbox',
    'Radio',
    'File',
] as const;
export type ElementType = typeof elementTypes[number];

export interface ElementTypeItem {
    type: ElementTypes;
    element: string;
    name: string;
    inputType?: string;
}

export const elementTypeItems: ElementTypeItem[] = [
    {
        type: ElementTypes.SingleLineText, // 'SingleLineText',
        name: 'Signle text',
        element: 'input',
        inputType: 'text',
    },
    {
        type: ElementTypes.DateTime, //'Datetime',
        name: 'Date and time',
        element: 'input',
        inputType: 'datetime-local',
    },
    {
        type: ElementTypes.Date, //   'Date',
        name: 'Date',
        element: 'input',
        inputType: 'date',
    },
    {
        type: ElementTypes.Time, // 'Time',
        name: 'Time',
        element: 'input',
        inputType: 'time',
    },
    {
        type: ElementTypes.Email, // 'Email',
        name: 'Email',
        element: 'input',
        inputType: 'email',
    },
    {
        type: ElementTypes.NumberInteger, // 'NumberInteger',
        name: 'Integer number',
        element: 'input',
        inputType: 'number',
    },
    {
        type: ElementTypes.NumberFloat, // 'NumberFloat',
        name: 'Real number',
        element: 'input',
        inputType: 'number',
    },
    {
        type: ElementTypes.Select, //'Select',
        name: 'Select',
        element: 'select',
    },
    {
        type: ElementTypes.MultiLineText, // 'MultiLineText',
        name: 'Multi text',
        element: 'textarea',
    },
    {
        type: ElementTypes.Checkbox, // 'Checkbox',
        name: 'Check boxes',
        element: 'input',
        inputType: 'checkbox',
    },
    {
        type: ElementTypes.Radio, // 'Radio',
        name: 'Radio buttons',
        element: 'input',
        inputType: 'radio',
    },
    {
        type: ElementTypes.File, //'File',
        name: 'File',
        element: 'input',
        inputType: 'file',
    },
];

export const inputTypes = ['text', 'date', 'datetime', 'time'] as const;

export type InputTypes = typeof inputTypes[number];

// export interface FormItem {
//     id: string;
//     label: string;
//     description?: string;
//     elementType: ElementType;
//     name: string;
//     options?: string;
//     isRequired?: boolean;
//     placeholder?: string;
// }

// export interface FormSource {
//     id: string;
//     title?: string;
//     items: FormItem[];
// }

export type FormAnswer = {
    answers?: string | string[];
} & FormItemModel;

export type FormValues = Record<string, string | string[]>;

export interface FormResult {
    id: string;
    formId: string;
    items: FormAnswer[];
}
