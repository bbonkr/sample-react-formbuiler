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
import { OptionsBuilder } from './OptionsBuilder';
import { FormItemForm } from './FormItemForm';
import Modal from '../Modal';

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
        initialValues: undefined,
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

    const handleOptionBuilderChange = (options: FormItemOptionModel[]) => {
        setFieldValue('options', options ?? []);
    };

    const handleInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        if (name === 'title') {
            setCurrentFormSource((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

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
        resetForm(undefined);
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

    const handleClickAddField = () => {
        setValues({});
    };

    const handleCloseModal = () => {
        setValues(undefined);
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
        <React.Fragment>
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
                        <button
                            className="button"
                            onClick={handleNewFormSource}
                        >
                            New
                        </button>
                        <button
                            className="button danger"
                            onClick={handleDeleteFormSource}
                        >
                            Delete
                        </button>
                        <button
                            className="button"
                            onClick={handleSaveFormSource}
                        >
                            Save
                        </button>
                    </div>
                </div>

                <hr className="my-3" />

                {currentFormSource && (
                    <div className="flex flex-col">
                        <div className="flex flex-col my-6">
                            <label>Title:</label>
                            <input
                                type="text"
                                name="title"
                                title="Title"
                                value={currentFormSource?.title ?? ''}
                                onChange={handleInputChanged}
                            />
                        </div>

                        <button
                            type="button"
                            className="button primary"
                            onClick={handleClickAddField}
                        >
                            Add field
                        </button>
                    </div>
                )}

                <div className="flex flex-row w-full gap-3">
                    <div className="flex-1">
                        <h2 className="text-lg font-extrabold my-2">Preview</h2>
                        <FormRenderer
                            formItems={currentFormSource?.items}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onChangeOrder={handleChangeOrder}
                        />
                    </div>
                </div>

                <div className="flex flex-col my-6">
                    <h3 className="text-lg font-extrabold">Debug</h3>
                    <div className="flex flex-row justify-center items-stretch ">
                        <div className="flex-1">
                            Result:
                            <pre className="break-words whitespace-pre-wrap">
                                {JSON.stringify(
                                    currentFormSource?.items,
                                    null,
                                    4,
                                )}
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
            </div>
            <Modal
                isOpen={Boolean(values)}
                title={<h2 className="font-extrabold my-2">Form Item</h2>}
                onClose={handleCloseModal}
            >
                <FormItemForm
                    values={values}
                    isValid={isValid}
                    errors={errors}
                    getFieldProps={getFieldProps}
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                    onChangeElementType={handleChangeElementType}
                    onChangeName={handleChangeName}
                    onChangeOptionBuilder={handleOptionBuilderChange}
                />
            </Modal>
        </React.Fragment>
    );
};

export default FormBuilder;
