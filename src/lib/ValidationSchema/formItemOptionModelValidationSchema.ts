import { number, object, SchemaOf, string } from 'yup';
import { FormItemOptionModel } from '../../api';

export const formItemOptionModelValidationSchema: SchemaOf<FormItemOptionModel> =
    object().shape({
        id: string(),
        formItemId: string(),
        value: string(),
        text: string(),
        ordinal: number(),
    });
