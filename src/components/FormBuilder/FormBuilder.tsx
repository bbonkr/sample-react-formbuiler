import React, { useEffect, useState } from 'react';
import { elementTypeItems, elementTypes, FormSource } from './types';
import type { FormItem, ElementType } from './types';
import { useFormik } from 'formik';
import FormPreview from './FormPreview';
import { boolean, object, SchemaOf, string, mixed } from 'yup';
import { useLocalStorage } from '../../hooks/useLocalStorage';

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
            return el === 'select' || el === 'checkbox' || el === 'radio';
        },
        then: string().required(),
    }),
    isRequired: boolean(),
    inputType: string(),
});

const FormBuilder = () => {
    const [currentFormSourceId, setCurrentFormSourceId] = useState<string>();
    const [currentFormSource, setCurrentFormSource] = useState<FormSource>();

    const { forms, addOrUpdateFormData, removeFormData } = useLocalStorage();

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

                setCurrentFormSource((prevState) => {
                    const current = prevState ?? {
                        id: `${+new Date()}`,
                        items: [],
                    };

                    const index = current.items.findIndex(
                        (x) => x.id === formItem.id,
                    );
                    if (index >= 0) {
                        current.items.splice(index, 1, formItem);
                    } else {
                        current.items.push(formItem);
                    }

                    return {
                        ...current,
                        items: [...current.items],
                    };
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
        setCurrentFormSource((prevState) => {
            const index = prevState.items.findIndex((x) => x.id === item.id);
            if (index >= 0) {
                prevState.items.splice(index, 1);

                return {
                    ...prevState,
                    items: [...prevState.items],
                };
            }

            return prevState;
        });
        resetForm({});
    };

    const handleChangeOrder = (item: FormItem, indexToChange: number) => {
        setCurrentFormSource((prevState) => {
            if (indexToChange >= 0 && indexToChange < prevState.items.length) {
                const currentIndex = prevState.items.findIndex(
                    (x) => x.id === item.id,
                );

                if (currentIndex >= 0) {
                    prevState.items.splice(currentIndex, 1);
                    prevState.items.splice(indexToChange, 0, item);

                    return {
                        ...prevState,
                        items: [...prevState.items],
                    };
                }
            }

            return prevState;
        });
    };

    const handleChangeFormSourceSelect = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const formSourceId = e.target.value;

        setCurrentFormSourceId((_) => formSourceId);
    };

    const handleNewFormSource = () => {
        setCurrentFormSourceId((_) => '');
        setCurrentFormSource((_) => ({ id: `${+new Date()}`, items: [] }));
    };

    const handleSaveFormSource = () => {
        addOrUpdateFormData(currentFormSource);
    };

    const handleDeleteFormSource = () => {
        removeFormData(currentFormSource);

        setCurrentFormSourceId((_) => '');
    };

    useEffect(() => {
        if (currentFormSourceId) {
            const formSource = forms.find((x) => x.id === currentFormSourceId);

            setCurrentFormSource((_) => formSource);
        } else {
            setCurrentFormSource((_) => undefined);
        }
    }, [currentFormSourceId]);

    return (
        <div>
            <div className="flex flex-row justify-center items-stretch gap-3">
                <div className="flex-1">
                    <select
                        className="w-full"
                        onChange={handleChangeFormSourceSelect}
                        value={currentFormSourceId}
                    >
                        <option value="">Select form</option>
                        {forms?.map((item) => {
                            return (
                                <option key={item.id} value={item.id}>
                                    {item.id}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="flex gap-3">
                    <button className="button" onClick={handleNewFormSource}>
                        New
                    </button>
                    <button
                        className="button danger"
                        onClick={handleDeleteFormSource}
                    >
                        Delete
                    </button>
                    <button className="button" onClick={handleSaveFormSource}>
                        Save
                    </button>
                </div>
            </div>
            <div className="flex flex-row w-full gap-3">
                <div className="flex-1">
                    <h2 className="font-extrabold my-2">Preview</h2>
                    <FormPreview
                        formItems={currentFormSource?.items}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onChangeOrder={handleChangeOrder}
                    />
                </div>
                <div className="flex-1 ">
                    <h2 className="font-extrabold my-2">Form Item</h2>
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
                        {JSON.stringify(currentFormSource?.items, null, 4)}
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
