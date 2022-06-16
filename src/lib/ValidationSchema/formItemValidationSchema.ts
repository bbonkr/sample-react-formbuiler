import { array, boolean, mixed, number, object, SchemaOf, string } from 'yup';
import {
    ElementTypes,
    FormItemLocaledModel,
    FormItemModel,
    FormItemOptionModel,
} from '../../api';
import { formItemOptionModelValidationSchema } from './formItemOptionModelValidationSchema';

export const formItemLocaledModelValidationSchema: SchemaOf<FormItemLocaledModel> =
    object().shape({
        formId: string(),
        languageId: string(),
        languageCode: string(),
        label: string(),
        description: string(),
        placeholder: string(),
    });

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
        locales: array<FormItemLocaledModel>().of(
            formItemLocaledModelValidationSchema,
        ),
    });
