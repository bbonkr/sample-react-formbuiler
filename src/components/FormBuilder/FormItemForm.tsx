import React from 'react';
import {
    ElementTypes,
    FormItemModel,
    FormItemOptionModel,
    FormModel,
    LanguageModel,
} from '../../api';
import { OptionsBuilder } from './OptionsBuilder';
import { ElementType, elementTypeItems } from '../FormRenderer/types';
import { useFormik } from 'formik';
import { formItemModelValidationSchema } from '../../lib/ValidationSchema';

interface FormItemFormProps {
    initialFormItem?: Partial<FormItemModel>;
    form?: FormModel;
    langauge?: LanguageModel;
    onEdited?: (formItem: FormItemModel) => void;
    onCancel?: () => void;
}

export const FormItemForm = ({
    initialFormItem,
    form,
    langauge,
    onEdited,
    onCancel,
}: FormItemFormProps) => {
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
                <label>
                    Label:
                    <span className="text-red-500"> {errors.label}</span>
                </label>
                <input
                    type="text"
                    className="form-input"
                    {...getFieldProps('label')}
                    value={values?.label ?? ''}
                />
            </div>

            <div className="flex flex-col">
                <label>
                    Placeholder:
                    <span className="text-red-500"> {errors.placeholder}</span>
                </label>
                <input
                    type="text"
                    className="form-input"
                    {...getFieldProps('placeholder')}
                    value={values?.placeholder ?? ''}
                />
            </div>

            <div className="flex flex-col">
                <label>Description:</label>
                <textarea
                    {...getFieldProps('description')}
                    value={values?.description ?? ''}
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
                    language={langauge}
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
