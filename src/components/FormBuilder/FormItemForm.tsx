import React, { useState } from 'react';
import {
    ElementTypes,
    FormItemModel,
    FormItemOptionModel,
    FormModel,
    LanguageModel,
    TranslationsApi,
} from '../../api';
import { OptionsBuilder } from './OptionsBuilder';
import { ElementType, elementTypeItems } from '../FormRenderer/types';
import { useFormik } from 'formik';
import { formItemModelValidationSchema } from '../../lib/ValidationSchema';

interface FormItemFormProps {
    initialFormItem?: Partial<FormItemModel>;
    form?: FormModel;
    language?: LanguageModel;
    defaultLanguageCode?: string;
    translationApiClient?: TranslationsApi;
    onEdited?: (formItem: FormItemModel) => void;
    onCancel?: () => void;
}

export const FormItemForm = ({
    initialFormItem,
    form,
    language,
    defaultLanguageCode,
    translationApiClient,
    onEdited,
    onCancel,
}: FormItemFormProps) => {
    const [translating, setTranslating] = useState(false);

    const {
        values,
        errors,
        isValid,
        isValidating,
        isSubmitting,
        handleSubmit,
        handleReset,
        handleChange,
        getFieldProps,
        setValues,
        setFieldValue,
        setFieldError,
        resetForm,
    } = useFormik<Partial<FormItemModel>>({
        initialValues: initialFormItem,
        enableReinitialize: true,
        validationSchema: formItemModelValidationSchema,
        onSubmit: (v, helper) => {
            if (isValid) {
                const formItem = v as FormItemModel;

                let hasSameName = false;
                form?.items?.forEach((item) => {
                    if (
                        item.id !== formItem.id &&
                        item.name === formItem.name
                    ) {
                        hasSameName = true;
                    }
                });

                if (hasSameName) {
                    setFieldError(
                        'name',
                        'Name field has to need unique value',
                    );
                } else {
                    if (onEdited) {
                        onEdited(formItem);
                    }

                    helper.resetForm({});
                }
            }
        },
        onReset: (v, helper) => {
            if (onCancel) {
                onCancel();
            }
        },
    });

    const handleChangeElementType = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const selectedElementType = e.target.value as ElementType;

        if (!['select', 'checkbox', 'radio'].includes(selectedElementType)) {
            setFieldValue('options', undefined);
            setFieldError('options', undefined);
        }

        if (selectedElementType === 'Radio') {
            setFieldValue('isRequired', true);
        } else {
            setFieldValue('isRequired', false);
        }

        handleChange(e);
    };

    const handleChangeInputLocaled = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        if (language && language.code !== defaultLanguageCode) {
            const name = e.target.name;
            const value = e.target.value;

            const tempArray = values.locales?.slice() ?? [];

            const foundItem = tempArray.find(
                (x) => x.languageId === language.id,
            );
            const foundIndex = tempArray.findIndex(
                (x) => x.languageId === language.id,
            );

            if (foundIndex >= 0) {
                tempArray.splice(foundIndex, 1, {
                    ...foundItem,
                    [name]: value,
                });
            } else {
                tempArray.push({
                    formId: values.id,
                    languageId: language.id,
                    languageCode: language.code,
                    [name]: value,
                });
            }

            setFieldValue('locales', tempArray);
        } else {
            // set own field value when language is default langauge
            handleChange(e);
        }
    };

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nameValue = e.target.value;
        let hasSameName = false;
        form?.items?.forEach((item) => {
            if (item.id !== values.id && item.name === nameValue) {
                hasSameName = true;
            }
        });

        if (hasSameName) {
            setFieldError('name', 'Name field has to need unique value');
        }

        handleChange(e);
    };

    const handleOptionBuilderChange = (options: FormItemOptionModel[]) => {
        setFieldValue('options', options ?? []);
    };

    const handleClickTranslate = (name: string) => () => {
        if (language && language.code !== defaultLanguageCode) {
            const text: string = values[name];

            if (!Boolean(text?.trim())) {
                console.warn(
                    'Text is empty. There is no origin text to translate.',
                );
            } else {
                setTranslating((_) => true);

                translationApiClient
                    ?.apiv10TranslationsTranslate({
                        getTranslatedTextQuery: {
                            originLanguageCode: defaultLanguageCode,
                            translateToLanguageCode: language?.code,
                            isHtml: false,
                            text: values[name],
                        },
                    })
                    .then((response) => {
                        const translatedText = response.data.text;

                        const tempArray = values.locales?.slice() ?? [];

                        const foundItem = tempArray.find(
                            (x) => x.languageId === language.id,
                        );
                        const foundIndex = tempArray.findIndex(
                            (x) => x.languageId === language.id,
                        );

                        if (foundIndex >= 0) {
                            tempArray.splice(foundIndex, 1, {
                                ...foundItem,
                                [name]: translatedText,
                            });
                        } else {
                            tempArray.push({
                                formId: values.id,
                                languageId: language.id,
                                languageCode: language.code,
                                [name]: translatedText,
                            });
                        }

                        setFieldValue('locales', tempArray);
                    })
                    .finally(() => {
                        setTranslating((_) => false);
                    });
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            onReset={handleReset}
            className="flex flex-col gap-3"
        >
            <input
                type="hidden"
                {...getFieldProps('id')}
                value={values?.id ?? ''}
            />
            <div className="flex flex-col">
                <label>
                    Type:
                    <span className="text-red-500"> {errors.elementType}</span>
                </label>
                <select
                    {...getFieldProps('elementType')}
                    onChange={handleChangeElementType}
                    value={values?.elementType ?? ''}
                >
                    <option value="">Please select element type</option>
                    {elementTypeItems.map((item) => (
                        <option key={item.type} value={item.type}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                    <label className="flex-1">
                        Label:
                        <span className="text-red-500"> {errors.label}</span>
                    </label>
                    {language && language.code !== defaultLanguageCode && (
                        <button
                            type="button"
                            className="button sm"
                            onClick={handleClickTranslate('label')}
                            disabled={translating}
                        >
                            Translate
                        </button>
                    )}
                </div>
                <input
                    type="text"
                    className="form-input"
                    {...getFieldProps('label')}
                    onChange={handleChangeInputLocaled}
                    value={
                        (language && language.code !== defaultLanguageCode
                            ? values.locales?.find(
                                  (x) => x.languageId === language.id,
                              )?.label
                            : values?.label) ?? ''
                    }
                />
            </div>

            <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                    <label className="flex-1">
                        Placeholder:
                        <span className="text-red-500">
                            {' '}
                            {errors.placeholder}
                        </span>
                    </label>
                    {language && language.code !== defaultLanguageCode && (
                        <button
                            type="button"
                            className="button sm"
                            onClick={handleClickTranslate('placeholder')}
                            disabled={translating}
                        >
                            Translate
                        </button>
                    )}
                </div>
                <input
                    type="text"
                    className="form-input"
                    {...getFieldProps('placeholder')}
                    onChange={handleChangeInputLocaled}
                    value={
                        (language && language.code !== defaultLanguageCode
                            ? values.locales?.find(
                                  (x) => x.languageId === language.id,
                              )?.placeholder
                            : values?.placeholder) ?? ''
                    }
                />
            </div>

            <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                    <label>Description:</label>
                    {language && language.code !== defaultLanguageCode && (
                        <button
                            type="button"
                            className="button sm"
                            onClick={handleClickTranslate('description')}
                            disabled={translating}
                        >
                            Translate
                        </button>
                    )}
                </div>
                <textarea
                    {...getFieldProps('description')}
                    onChange={handleChangeInputLocaled}
                    value={
                        (language && language.code !== defaultLanguageCode
                            ? values.locales?.find(
                                  (x) => x.languageId === language.id,
                              )?.description
                            : values?.description) ?? ''
                    }
                />
            </div>
            <div className="flex flex-col">
                <label>
                    Name:
                    <span className="text-red-500"> {errors.name}</span>
                </label>
                <input
                    type="text"
                    {...getFieldProps('name')}
                    onChange={handleChangeName}
                    value={values?.name ?? ''}
                />
            </div>
            <div className="flex flex-col">
                <label>
                    Options:
                    <span className="text-red-500">
                        {' '}
                        {/* // TODO options */}
                        {/* {errors.options} */}
                    </span>
                </label>
                <OptionsBuilder
                    options={values?.options ?? []}
                    language={language}
                    defaultLanguageCode={defaultLanguageCode}
                    translationApiClient={translationApiClient}
                    disabled={
                        ![
                            ElementTypes.Select,
                            ElementTypes.Checkbox,
                            ElementTypes.Radio,
                        ].includes(values?.elementType)
                    }
                    onChange={handleOptionBuilderChange}
                />
            </div>
            <div className="flex flex-col">
                <label className="">Required:</label>
                <label className="checkbox">
                    <input
                        className="form-control"
                        type="checkbox"
                        {...getFieldProps('isRequired')}
                        checked={values?.isRequired ?? false}
                        disabled={values?.elementType === 'Radio'}
                    />
                    {' This field is required'}
                </label>
            </div>
            <div className="flex flex-row justify-center items-stretch my-6">
                {values?.id && (
                    <button className="button flex-1" type="reset">
                        Cancel
                    </button>
                )}
                <button
                    className="button primary flex-1"
                    type="submit"
                    disabled={!isValid}
                >
                    {values?.id ? 'Update' : 'Add'} Field
                </button>
            </div>
        </form>
    );
};
