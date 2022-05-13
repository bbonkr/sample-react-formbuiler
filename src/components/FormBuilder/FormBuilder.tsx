import React, { useState } from 'react';
import { elementTypeItems, elementTypes, inputTypes } from './types';
import type { FormItem, ElementType } from './types';
import { useFormik } from 'formik';
import FormPreview from './FormPreview';
import { boolean, object, SchemaOf, string, mixed } from 'yup';

const validationSchema: SchemaOf<FormItem> = object({
    id: string(),
    elementType: mixed<ElementType>()
        .required()
        .oneOf([...elementTypes]),
    label: string().required(),
    name: string().required(),
    description: string(),
    options: string().when('elementType', {
        is: (el) => {
            console.info(el);
            return el === 'select' || el === 'checkbox' || el === 'radio';
        },
        then: string().required(),
    }),
    isRequired: boolean(),
    inputType: string(),
});

const FormBuilder = () => {
    const [result, setResult] = useState<FormItem[]>([]);

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
    } = useFormik<Partial<FormItem>>({
        initialValues: {},
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (v, helper) => {
            if (isValid) {
                const formItem = v as FormItem;

                if (!formItem.id) {
                    formItem.id = `${+new Date()}`;
                }

                setResult((prevState) => {
                    const index = prevState.findIndex(
                        (x) => x.id === formItem.id,
                    );
                    if (index >= 0) {
                        prevState.splice(index, 1, formItem);
                    } else {
                        prevState.push(formItem);
                    }
                    return [...prevState];
                });

                helper.resetForm({});
            }
        },
        onReset: (v, helper) => {},
    });

    const handleChangeElementType = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const selectedElementType = e.target.value as ElementType;

        if (!['select', 'checkbox', 'radio'].includes(selectedElementType)) {
            setFieldValue('options', undefined);
            setFieldError('options', undefined);
        }

        handleChange(e);
    };

    const handleEdit = (item: FormItem) => {
        setValues(item);
    };

    const handleDelete = (item: FormItem) => {
        setResult((prevState) => {
            const index = result.findIndex((x) => x.id === item.id);
            if (index >= 0) {
                prevState.splice(index, 1);
                return [...prevState];
            }

            return prevState;
        });
        resetForm({});
    };

    const handleChangeOrder = (item: FormItem, indexToChange: number) => {
        setResult((prevState) => {
            if (indexToChange >= 0 && indexToChange < prevState.length) {
                const currentIndex = prevState.findIndex(
                    (x) => x.id === item.id,
                );

                if (currentIndex >= 0) {
                    prevState.splice(currentIndex, 1);
                    prevState.splice(indexToChange, 0, item);

                    return [...prevState];
                }
            }

            return prevState;
        });
    };

    return (
        <div>
            <div className="flex flex-row w-full gap-3">
                <div className="flex-1">
                    <FormPreview
                        formItems={result}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onChangeOrder={handleChangeOrder}
                    />
                </div>
                <div className="flex-1 ">
                    <form
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                        className="flex flex-col gap-3"
                    >
                        <input
                            type="hidden"
                            {...getFieldProps('id')}
                            value={values.id ?? ''}
                        />
                        <div className="flex flex-col">
                            <label>
                                Type:
                                <span className="text-red-500">
                                    {' '}
                                    {errors.elementType}
                                </span>
                            </label>
                            <select
                                {...getFieldProps('elementType')}
                                onChange={handleChangeElementType}
                                value={values.elementType ?? ''}
                            >
                                <option value="">
                                    Please select element type
                                </option>
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
                                <span className="text-red-500">
                                    {' '}
                                    {errors.label}
                                </span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                {...getFieldProps('label')}
                                value={values.label ?? ''}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Description:</label>
                            <textarea
                                {...getFieldProps('description')}
                                value={values.description ?? ''}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>
                                Name:
                                <span className="text-red-500">
                                    {' '}
                                    {errors.name}
                                </span>
                            </label>
                            <input
                                type="text"
                                {...getFieldProps('name')}
                                value={values.name ?? ''}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>
                                Options:
                                <span className="text-red-500">
                                    {' '}
                                    {errors.options}
                                </span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                {...getFieldProps('options')}
                                value={values.options ?? ''}
                                disabled={
                                    !['select', 'checkbox', 'radio'].includes(
                                        values.elementType,
                                    )
                                }
                                readOnly={
                                    !['select', 'checkbox', 'radio'].includes(
                                        values.elementType,
                                    )
                                }
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="">Required:</label>
                            <label className="checkbox">
                                <input
                                    className="form-control"
                                    type="checkbox"
                                    {...getFieldProps('isRequired')}
                                    checked={values.isRequired ?? false}
                                />
                                {' This field is required'}
                            </label>
                        </div>
                        <div className="flex flex-row justify-center items-stretch my-6">
                            {values.id && (
                                <button className="button flex-1" type="reset">
                                    Reset
                                </button>
                            )}
                            <button
                                className="button primary flex-1"
                                type="submit"
                                disabled={!isValid}
                            >
                                {values.id ? 'Update' : 'Add'} Field
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="flex flex-row justify-center items-stretch">
                <div className="flex-1">
                    Result:
                    <pre className="w-full">
                        {JSON.stringify(result, null, 4)}
                    </pre>
                </div>
                <div className="flex-1">
                    Current Form item:
                    <pre className="w-full">
                        {JSON.stringify(values, null, 4)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default FormBuilder;
