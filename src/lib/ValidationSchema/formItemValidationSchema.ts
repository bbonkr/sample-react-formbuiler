import { array, boolean, mixed, number, object, SchemaOf, string } from 'yup';
import { ElementTypes, FormItemModel, FormItemOptionModel } from '../../api';
import { formItemOptionModelValidationSchema } from './formItemOptionModelValidationSchema';

export const formItemModelValidationSchema: SchemaOf<FormItemModel> =
    object().shape({
        id: string(),
        formId: string(),
        title: string(),
        elementType: mixed<ElementTypes>()
            .required()
            .oneOf([...Object.values(ElementTypes)]),
        label: string().required(),
        name: string().required(),
        description: string(),
        options: array<FormItemOptionModel>().of(
            formItemOptionModelValidationSchema,
        ),
        isRequired: boolean(),
        inputType: string(),
        placeholder: string(),
        ordinal: number(),
    });
