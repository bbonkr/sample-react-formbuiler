import { array, number, object, SchemaOf, string } from 'yup';
import { FormItemModel, FormLocaledModel, FormModel } from '../../api';
import { formItemModelValidationSchema } from './formItemValidationSchema';

export const formLocaledModelValidationSchema: SchemaOf<FormLocaledModel> =
    object().shape({
        formId: string(),
        languageCode: string(),
        languageId: string(),
        title: string().required(),
    });

export const formModelValidationSchema: SchemaOf<FormModel> = object().shape({
    id: string(),
    title: string().required(),
    content: string(),
    items: array<FormItemModel>().of(formItemModelValidationSchema),
    resultsCount: number(),
    locales: array<FormLocaledModel>().of(formLocaledModelValidationSchema),
});
