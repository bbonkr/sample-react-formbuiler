export const elementTypes = [
    'single-text-input',
    'date',
    'datetime',
    'time',
    'email',
    'number-int',
    'number-float',
    'select',
    'multi-text-input',
    'checkbox',
    'radio',
] as const;
export type ElementType = typeof elementTypes[number];

export interface ElementTypeItem {
    type: ElementType;
    element: string;
    name: string;
    inputType?: string;
}

export const elementTypeItems: ElementTypeItem[] = [
    {
        type: 'single-text-input',
        name: 'Signle text',
        element: 'input',
        inputType: 'text',
    },
    {
        type: 'datetime',
        name: 'Date and time',
        element: 'input',
        inputType: 'datetime-local',
    },
    { type: 'date', name: 'Date', element: 'input', inputType: 'date' },
    { type: 'time', name: 'Time', element: 'input', inputType: 'time' },
    { type: 'email', name: 'Email', element: 'input', inputType: 'email' },
    {
        type: 'number-int',
        name: 'Integer number',
        element: 'input',
        inputType: 'number',
    },
    {
        type: 'number-float',
        name: 'Real number',
        element: 'input',
        inputType: 'number',
    },
    { type: 'select', name: 'Select', element: 'select' },
    { type: 'multi-text-input', name: 'Multi text', element: 'textarea' },
    {
        type: 'checkbox',
        name: 'Check boxes',
        element: 'input',
        inputType: 'checkbox',
    },
    {
        type: 'radio',
        name: 'Radio buttons',
        element: 'input',
        inputType: 'radio',
    },
];

export const inputTypes = ['text', 'date', 'datetime', 'time'] as const;

export type InputTypes = typeof inputTypes[number];

export interface FormItem {
    id: string;
    label: string;
    description?: string;
    elementType: ElementType;
    name: string;
    // inputType?: InputTypes;
    options?: string;
    isRequired?: boolean;
}

export interface FormSource {
    id: string;
    items: FormItem[];
}

export type FormAnswer = {
    answers?: string | string[];
} & FormItem;

export type FormValues = Record<string, string | string[]>;

export interface FormResult {
    id: string;
    formId: string;
    items: FormAnswer[];
}
