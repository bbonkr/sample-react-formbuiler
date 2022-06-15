import React, { useEffect, useState } from 'react';
import FormRenderer from '../FormRenderer/FormRenderer';
import { useFormsApi } from '../../hooks/useFormsApi';
import { FormItemModel, FormModel, LanguageModel } from '../../api';
import { FormItemForm } from './FormItemForm';
import Modal from '../Modal';
import LanguageSelector from '../LanguageSelector';

const FormBuilder = () => {
    const [currentFormId, setCurrentFormId] = useState<string>();
    const [currentForm, setCurrentForm] = useState<FormModel>();
    const [currentFormItem, setCurrentFormItem] =
        useState<Partial<FormItemModel>>();
    const [currentLanguage, setCurrentLanguage] = useState<LanguageModel>();

    const {
        formPagedModel,
        addedOrUpdatedFormId,
        addForm,
        updateForm,
        deleteForm,
    } = useFormsApi();

    const handleEditedFormItem = (formItem: FormItemModel) => {
        setCurrentForm((prevState) => {
            const current = prevState ?? {
                // id: `${+new Date()}`,
                id: '',
                items: [],
            };

            const index = current.items.findIndex((x) => x.id === formItem.id);
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

        // close modal
        setCurrentFormItem((_) => undefined);
    };

    const handleClickCancelFormItem = () => {
        setCurrentFormItem((_) => undefined);
    };

    const handleInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        if (name === 'title') {
            setCurrentForm((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleEdit = (item: FormItemModel) => {
        setCurrentFormItem((_) => item);
    };

    const handleDelete = (item: FormItemModel) => {
        setCurrentForm((prevState) => {
            const tempItems = prevState.items.slice();

            const index = tempItems.findIndex((x) => x.id === item.id);

            if (index >= 0) {
                tempItems.splice(index, 1);
                tempItems.forEach((item, index) => {
                    item.ordinal = index + 1;
                });

                return {
                    ...prevState,
                    items: [...tempItems],
                };
            }

            return prevState;
        });

        // close modal
        setCurrentFormItem((_) => undefined);
    };

    const handleChangeOrder = (item: FormItemModel, indexToChange: number) => {
        setCurrentForm((prevState) => {
            if (indexToChange >= 0 && indexToChange < prevState.items.length) {
                const currentIndex = prevState.items.findIndex(
                    (x) => x.id === item.id,
                );

                if (currentIndex >= 0) {
                    const temp = [...prevState.items];
                    temp.splice(currentIndex, 1);
                    temp.splice(indexToChange, 0, item);

                    temp.forEach((item, index) => {
                        item.ordinal = index + 1;
                    });

                    return {
                        ...prevState,
                        items: [...temp],
                    };
                }
            }

            return prevState;
        });
    };

    const handleChangeFormSelect = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const formSourceId = e.target.value;

        setCurrentFormId((_) => formSourceId);
    };

    const handleClickNewForm = () => {
        setCurrentFormId((_) => '');
    };

    const handleClickSaveForm = () => {
        if (currentForm.id) {
            updateForm(currentForm);
        } else {
            addForm(currentForm);
        }
    };

    const handleClickDeleteForm = () => {
        deleteForm(currentForm);

        setCurrentFormId((_) => '');
    };

    const handleClickAddField = () => {
        // setValues({});
        setCurrentFormItem((_) => ({}));
    };

    const handleCloseModal = () => {
        // setValues(undefined);
        setCurrentFormItem((_) => undefined);
    };

    const handleChangeLanguage = (language: LanguageModel) => {
        setCurrentLanguage((_) => language);
    };

    useEffect(() => {
        if (currentFormId) {
            const formSource = formPagedModel?.items?.find(
                (x) => x.id === currentFormId,
            );

            setCurrentForm((_) => formSource);
        } else {
            setCurrentForm((_) => ({
                // new form
            }));
        }
    }, [currentFormId]);

    useEffect(() => {
        setCurrentFormId((_) => addedOrUpdatedFormId ?? '');
    }, [addedOrUpdatedFormId]);

    useEffect(() => {
        console.info('Selected language: ', currentLanguage);
    }, [currentLanguage]);

    return (
        <React.Fragment>
            <div className="flex flex-col">
                <div className="flex flex-row justify-center items-stretch gap-3">
                    <div className="flex-1">
                        <select
                            className="w-full"
                            onChange={handleChangeFormSelect}
                            value={currentFormId}
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
                        <button className="button" onClick={handleClickNewForm}>
                            New
                        </button>
                        <button
                            className="button danger"
                            onClick={handleClickDeleteForm}
                        >
                            Delete
                        </button>
                        <button
                            className="button"
                            onClick={handleClickSaveForm}
                        >
                            Save
                        </button>
                    </div>
                </div>

                <hr className="my-3" />

                {currentForm && (
                    <div className="flex flex-col">
                        <div className="flex flex-col my-6 ">
                            <label htmlFor="formbuilder-form-language">
                                Language:
                            </label>
                            <LanguageSelector
                                id="formbuilder-form-language"
                                disabled={!Boolean(currentForm?.id)}
                                value={currentLanguage?.id ?? ''}
                                onChange={handleChangeLanguage}
                            />
                            {!Boolean(currentForm?.id) && (
                                <p className="text-sm font-light text-slate-500 dark:text-slate-400">
                                    You can change language after save form data
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col my-6 ">
                            <label htmlFor="formbuilder-form-title">
                                Title:
                            </label>
                            <input
                                type="text"
                                id="formbuilder-form-title"
                                name="title"
                                title="Title"
                                value={currentForm?.title ?? ''}
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
                            formItems={currentForm?.items}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onChangeOrder={handleChangeOrder}
                        />
                    </div>
                </div>

                <div className="flex flex-col my-6 gap-3">
                    <h3 className="text-lg font-extrabold">Debug</h3>
                    <div className="flex flex-row justify-center items-stretch gap-3">
                        <div className="flex-1">
                            Result:
                            <pre className="break-words whitespace-pre-wrap bg-slate-600 text-slate-200 px-2 py-3 border-2 rounded border-slate-600">
                                {JSON.stringify(currentForm?.items, null, 4)}
                            </pre>
                        </div>
                        <div className="flex-1">
                            Current Form item:
                            <pre className="break-words whitespace-pre-wrap bg-slate-600 text-slate-200 px-2 py-3 border-2 rounded border-slate-600">
                                {JSON.stringify(currentFormItem, null, 4)}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={Boolean(currentFormItem)}
                title={<h2 className="font-extrabold my-2">Form Item</h2>}
                onClose={handleCloseModal}
            >
                <FormItemForm
                    initialFormItem={currentFormItem}
                    form={currentForm}
                    onEdited={handleEditedFormItem}
                    onCancel={handleClickCancelFormItem}
                />
            </Modal>
        </React.Fragment>
    );
};

export default FormBuilder;
