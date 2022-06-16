import React, { useEffect, useMemo, useState } from 'react';
import FormRenderer from '../FormRenderer/FormRenderer';
import { useFormsApi } from '../../hooks/useFormsApi';
import {
    FormItemModel,
    FormModel,
    LanguageModel,
    TranslationsApi,
} from '../../api';
import { FormItemForm } from './FormItemForm';
import Modal from '../Modal';
import LanguageSelector from '../LanguageSelector';

const FormBuilder = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API ?? '';
    const defaultLanguageCode = 'en';

    const [currentFormId, setCurrentFormId] = useState<string>();
    const [currentForm, setCurrentForm] = useState<FormModel>();
    const [currentFormItem, setCurrentFormItem] =
        useState<Partial<FormItemModel>>();
    const [currentLanguage, setCurrentLanguage] = useState<LanguageModel>();
    const [translating, setTranslating] = useState(false);

    const translationApiClient = useMemo(() => {
        const client = new TranslationsApi(undefined, baseUrl);
        return client;
    }, []);

    const {
        formPagedModel,
        addedOrUpdatedFormId,
        getForms,
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
            let language: LanguageModel = undefined;
            if (currentLanguage?.code !== defaultLanguageCode) {
                language = currentLanguage;
            }

            setCurrentForm((prevState) => {
                if (language) {
                    const tempLocales = prevState.locales?.slice() ?? [];
                    const index = tempLocales.findIndex(
                        (x) => x.languageId === language.id,
                    );

                    if (index >= 0) {
                        tempLocales.splice(index, 1);
                    }

                    tempLocales.push({
                        languageId: language.id,
                        languageCode: language.code,
                        title: value,
                    });

                    return {
                        ...prevState,
                        locales: [
                            ...tempLocales.filter(
                                (x) => x.languageCode !== defaultLanguageCode,
                            ),
                        ],
                    };
                }

                return {
                    ...prevState,
                    locales: [
                        ...prevState.locales?.filter(
                            (x) => x.languageCode !== defaultLanguageCode,
                        ),
                    ],
                    [name]: value,
                };
            });
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

        setCurrentLanguage((_) => undefined);
    };

    const handleClickNewForm = () => {
        setCurrentFormId((_) => '');
        setCurrentLanguage((_) => undefined);
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
        setCurrentLanguage((_) => undefined);
    };

    const handleClickAddField = () => {
        // setValues({});
        setCurrentFormItem((_) => ({
            id: `${+new Date()}`,
        }));
    };

    const handleCloseModal = () => {
        // setValues(undefined);
        setCurrentFormItem((_) => undefined);
    };

    const handleChangeLanguage = (language: LanguageModel) => {
        setCurrentLanguage((_) => language);
    };

    const handleClickTranslate = (name: string) => () => {
        setTranslating((_) => true);

        if (currentLanguage && currentLanguage.code !== defaultLanguageCode) {
            const text: string = currentForm[name];

            if (!Boolean(text?.trim())) {
                console.warn(
                    'Text is empty. There is no origin text to translate.',
                );
            } else {
                translationApiClient
                    .apiv10TranslationsTranslate({
                        getTranslatedTextQuery: {
                            originLanguageCode: defaultLanguageCode,
                            translateToLanguageCode: currentLanguage?.code,
                            text: text,
                            isHtml: false,
                        },
                    })
                    .then((response) => {
                        const translatedText = response.data.text;

                        setCurrentForm((prevState) => {
                            if (currentLanguage) {
                                const tempLocales =
                                    prevState.locales?.slice() ?? [];
                                const foundItem = tempLocales.find(
                                    (x) => x.languageId === currentLanguage.id,
                                );
                                const index = tempLocales.findIndex(
                                    (x) => x.languageId === currentLanguage.id,
                                );

                                if (index >= 0) {
                                    tempLocales.splice(index, 1, {
                                        ...foundItem,
                                        [name]: translatedText,
                                    });
                                } else {
                                    tempLocales.push({
                                        languageId: currentLanguage.id,
                                        languageCode: currentLanguage.code,
                                        [name]: translatedText,
                                    });
                                }

                                return {
                                    ...prevState,
                                    locales: [
                                        ...tempLocales.filter(
                                            (x) =>
                                                x.languageCode !==
                                                defaultLanguageCode,
                                        ),
                                    ],
                                };
                            }

                            return prevState;
                        });
                    })
                    .finally(() => {
                        setTranslating((_) => false);
                    });
            }
        }
    };

    const handleClickReloadForms = () => {
        setCurrentFormId((_) => '');
        getForms();
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

    return (
        <React.Fragment>
            <div className="flex flex-col">
                <div className="flex flex-row justify-center items-stretch gap-3">
                    <div className="flex-1 flex flex-row">
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
                        <button
                            type="button"
                            className="button flex"
                            onClick={handleClickReloadForms}
                        >
                            Reload
                        </button>
                    </div>

                    <div className="flex gap-3">
                        {/* <ImportData /> */}
                        <button className="button" onClick={handleClickNewForm}>
                            New
                        </button>
                        <button
                            className="button danger"
                            onClick={handleClickDeleteForm}
                            disabled={(currentForm?.resultsCount ?? 0) > 0}
                        >
                            Delete
                        </button>
                        <button
                            className="button"
                            onClick={handleClickSaveForm}
                            disabled={(currentForm?.resultsCount ?? 0) > 0}
                        >
                            Save
                        </button>
                    </div>
                </div>
                <div className="my-3 mx-1">
                    <p>
                        {typeof currentForm?.resultsCount === 'number'
                            ? `Selected form has ${currentForm?.resultsCount} result(s).`
                            : ''}
                    </p>
                    <p>
                        <span className="text-red-500 font-bold">
                            {(currentForm?.resultsCount ?? 0) > 0
                                ? `To avoid compromising response data, this form cannot modify or delete.`
                                : ''}
                        </span>
                    </p>
                </div>

                <hr className="my-3" />

                {currentForm && (
                    <div className="flex flex-col">
                        <div className="flex flex-col my-6 ">
                            <div className="flex flex-row">
                                <label htmlFor="formbuilder-form-language flex-1">
                                    Language:
                                </label>
                            </div>
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
                            <div className="flex flex-row justify-between">
                                <label htmlFor="formbuilder-form-title flex-1">
                                    Title:
                                </label>
                                {currentLanguage &&
                                    currentLanguage.code !==
                                        defaultLanguageCode && (
                                        <button
                                            type="button"
                                            className="button sm"
                                            onClick={handleClickTranslate(
                                                'title',
                                            )}
                                            disabled={translating}
                                        >
                                            Translate
                                        </button>
                                    )}
                            </div>
                            <input
                                type="text"
                                id="formbuilder-form-title"
                                name="title"
                                title="Title"
                                value={
                                    (currentLanguage &&
                                    currentLanguage?.code !==
                                        defaultLanguageCode
                                        ? currentForm?.locales?.find(
                                              (x) =>
                                                  x.languageId ===
                                                  currentLanguage?.id,
                                          )?.title
                                        : currentForm?.title) ?? ''
                                }
                                onChange={handleInputChanged}
                            />
                        </div>

                        <button
                            type="button"
                            className="button primary"
                            onClick={handleClickAddField}
                            disabled={(currentForm?.resultsCount ?? 0) > 0}
                        >
                            Add field
                        </button>
                    </div>
                )}

                <div className="flex flex-row w-full gap-3">
                    <div className="flex-1">
                        <h2 className="text-lg font-extrabold my-2">Preview</h2>
                        <FormRenderer
                            editingMode={(currentForm?.resultsCount ?? 0) === 0}
                            formItems={currentForm?.items}
                            language={currentLanguage}
                            defaultLanguageCode={defaultLanguageCode}
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
                                {JSON.stringify(currentForm, null, 4)}
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
                    language={currentLanguage}
                    defaultLanguageCode={defaultLanguageCode}
                    translationApiClient={translationApiClient}
                    onEdited={handleEditedFormItem}
                    onCancel={handleClickCancelFormItem}
                />
            </Modal>
        </React.Fragment>
    );
};

export default FormBuilder;
