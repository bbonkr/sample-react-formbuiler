import { number, object, SchemaOf, string, array } from 'yup';
import { FormItemOptionLocaledModel, FormItemOptionModel } from '../../api';

export const formItemOptionLocaledModelValidationSchema: SchemaOf<FormItemOptionLocaledModel> =
    object().shape({
        formItemOptionId: string(),
        languageId: string(),
        languageCode: string(),
        text: string().required(),
    });

export const formItemOptionModelValidationSchema: SchemaOf<FormItemOptionModel> =
    object().shape({
        id: string(),
        formItemId: string(),
        value: string(),
        text: string(),
        ordinal: number(),
        locales: array<FormItemOptionLocaledModel>().of(
            formItemOptionLocaledModelValidationSchema,
        ),
    });
