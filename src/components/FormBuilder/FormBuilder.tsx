import React, { useEffect, useState } from 'react';
import { elementTypeItems } from '../FormRenderer/types';
import type { ElementType } from '../FormRenderer/types';
import { useFormik } from 'formik';
import FormRenderer from '../FormRenderer/FormRenderer';
import { boolean, object, SchemaOf, string, mixed, number, array } from 'yup';
import { useFormsApi } from '../../hooks/useFormsApi';
import {
    FormItemModel,
    FormItemOptionModel,
    FormModel,
    ElementTypes,
} from '../../api';

const validationSchema: SchemaOf<FormItemModel> = object({
    id: string(),
    formId: string(),
    title: string(),
    elementType: mixed<ElementTypes>()
        .required()
        .oneOf([...Object.values(ElementTypes)]),
    label: string().required(),
    name: string().required(),
    description: string(),
    // options: string().when('elementType', {
    //     is: (el) => {
    //         return el === 'select' || el === 'checkbox' || el === 'radio';
    //     },
    //     then: string().required(),
    // }),
    options: array<FormItemOptionModel>().of(
        object({
            id: string(),
            formItemId: string(),
            value: string(),
            text: string(),
            ordinal: number(),
        }),
    ),
    isRequired: boolean(),
    inputType: string(),
    placeholder: string(),
    ordinal: number(),
});

const FormBuilder = () => {
    const [currentFormSourceId, setCurrentFormSourceId] = useState<string>();
    const [currentFormSource, setCurrentFormSource] = useState<FormModel>();

    // const { addOrUpdateFormData, removeFormData } = useLocalStorage();
    const {
        formPagedModel,
        // forms,
        addedOrUpdatedFormId,
        addForm,
        updateForm,
        deleteForm,
    } = useFormsApi();

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
        initialValues: {},
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (v, helper) => {
            if (isValid) {
                const formItem = v as FormItemModel;

                // if (!formItem.id) {
                //     formItem.id = `${+new Date()}`;
                // }

                let hasSameName = false;
                currentFormSource?.items?.forEach((item) => {
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
                    setCurrentFormSource((prevState) => {
                        const current = prevState ?? {
                            // id: `${+new Date()}`,
                            id: '',
                            items: [],
                        };

                        const index = current.items.findIndex(
                            (x) => x.id === formItem.id,
                        );
                        const temp = current.items.slice();
                        if (index >= 0) {
                            temp.splice(index, 1, formItem);
                        } else {
                            temp.push(formItem);
                        }

                        return {
                            ...current,
                            items: [
                                ...temp.map((t, i) => ({
                                    ...t,
                                    formId: current.id,
                                    ordinal: i + 1,
                                })),
                            ],
                        };
                    });

                    helper.resetForm({});
                }
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

        if (selectedElementType === 'Radio') {
            setFieldValue('isRequired', true);
        } else {
            setFieldValue('isRequired', false);
        }

        handleChange(e);
    };

    const handleEdit = (item: FormItemModel) => {
        setValues(item);
    };

    const handleDelete = (item: FormItemModel) => {
        setCurrentFormSource((prevState) => {
            const index = prevState.items.findIndex((x) => x.id === item.id);
            if (index >= 0) {
                return {
                    ...prevState,
                    items: [...prevState.items.filter((x) => x.id !== item.id)],
                };
            }

            return prevState;
        });
        resetForm({});
    };

    const handleChangeOrder = (item: FormItemModel, indexToChange: number) => {
        setCurrentFormSource((prevState) => {
            if (indexToChange >= 0 && indexToChange < prevState.items.length) {
                const currentIndex = prevState.items.findIndex(
                    (x) => x.id === item.id,
                );

                if (currentIndex >= 0) {
                    const temp = [...prevState.items];
                    temp.splice(currentIndex, 1);
                    temp.splice(indexToChange, 0, item);

                    return {
                        ...prevState,
                        items: [...temp],
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
        setCurrentFormSource((_) => ({
            // id: `${+new Date()}`,
            id: '',
            items: [],
        }));
    };

    const handleSaveFormSource = () => {
        if (currentFormSource.id) {
            updateForm(currentFormSource);
        } else {
            addForm(currentFormSource);
        }
        // setCurrentFormSourceId((_) => currentFormSource.id);
    };

    const handleDeleteFormSource = () => {
        deleteForm(currentFormSource);

        setCurrentFormSourceId((_) => '');
    };

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nameValue = e.target.value;
        let hasSameName = false;
        currentFormSource?.items?.forEach((item) => {
            if (item.id !== values.id && item.name === nameValue) {
                hasSameName = true;
            }
        });

        if (hasSameName) {
            setFieldError('name', 'Name field has to need unique value');
        }

        handleChange(e);
    };

    useEffect(() => {
        if (currentFormSourceId) {
            const formSource = formPagedModel?.items?.find(
                (x) => x.id === currentFormSourceId,
            );

            // console.info('formSource:', formSource);
            setCurrentFormSource((_) => formSource);
        } else {
            setCurrentFormSource((_) => undefined);
        }
    }, [currentFormSourceId]);

    useEffect(() => {
        setCurrentFormSourceId((_) => addedOrUpdatedFormId ?? '');
    }, [addedOrUpdatedFormId]);

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-center items-stretch gap-3">
                <div className="flex-1">
                    <select
                        className="w-full"
                        onChange={handleChangeFormSourceSelect}
                        value={currentFormSourceId}
                    >
                        <option value="">Select form</option>
                        {formPagedModel?.items?.map((item) => {
                            return (
                                <option key={item.id} value={item.id}>
                                    {item.id} {item.title}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="flex gap-3">
                    {/* <ImportData /> */}
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
                    <FormRenderer
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
                            <label>
                                Placeholder:
                                <span className="text-red-500">
                                    {' '}
                                    {errors.placeholder}
                                </span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                {...getFieldProps('placeholder')}
                                value={values.placeholder ?? ''}
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
                                onChange={handleChangeName}
                                value={values.name ?? ''}
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
                            <input
                                type="text"
                                className="form-input"
                                {...getFieldProps('options')}
                                value={values.options?.join(',') ?? ''}
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
                                    disabled={values.elementType === 'Radio'}
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
                    <pre className="break-words whitespace-pre-wrap">
                        {JSON.stringify(currentFormSource?.items, null, 4)}
                    </pre>
                </div>
                <div className="flex-1">
                    Current Form item:
                    <pre className="break-words whitespace-pre-wrap">
                        {JSON.stringify(values, null, 4)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default FormBuilder;
