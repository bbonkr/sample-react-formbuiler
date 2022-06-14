import { array, number, object, SchemaOf, string } from 'yup';
import { FormItemModel, FormModel } from '../../api';
import { formItemModelValidationSchema } from './formItemValidationSchema';

export const formModelValidationSchema: SchemaOf<FormModel> = object().shape({
    id: string(),
    title: string().required(),
    content: string(),
    items: array<FormItemModel>().of(formItemModelValidationSchema),
    resultsCount: number(),
});
