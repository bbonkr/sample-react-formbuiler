import React, { useState } from 'react';
import { FormItemOptionModel, LanguageModel, TranslationsApi } from '../../api';

interface OptionsBuilderProps {
    options?: FormItemOptionModel[];
    language?: LanguageModel;
    defaultLanguageCode?: string;
    translationApiClient?: TranslationsApi;
    disabled?: boolean;
    onChange?: (options: FormItemOptionModel[]) => void;
}

export const OptionsBuilder = ({
    options,
    language,
    defaultLanguageCode,
    translationApiClient,
    disabled,
    onChange,
}: OptionsBuilderProps) => {
    const [newOptionValue, setNewOptionValue] = useState<string>();
    const [translating, setTranslating] = useState(false);

    const handleNewOptionValueChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.value;
        setNewOptionValue((_) => value);
    };

    const handleClickAddNewOption = () => {
        if (onChange) {
            const tempOptions = (options ?? []).slice();

            tempOptions.push({
                id: `${+new Date()}`,
                value: newOptionValue,
                text: newOptionValue,
                ordinal: tempOptions.length + 1,
            });

            onChange([...tempOptions]);

            console.info('[INFO] Option item added', newOptionValue);

            setNewOptionValue((_) => '');
        }
    };

    const handleOptionChange =
        (option: FormItemOptionModel) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            var value = e.target.value;

            if (onChange) {
                const tempOptions = (options ?? []).slice();
                const foundOption = tempOptions.find((x) => x.id === option.id);
                const foundOptionIndex = tempOptions.findIndex(
                    (x) => x.id === option.id,
                );

                if (language && language.code !== defaultLanguageCode) {
                    const tempLocales = foundOption.locales?.slice() ?? [];

                    const foundOptionLocaledItem = tempLocales.find(
                        (x) => x.languageId === language.id,
                    );
                    const foundOptionLocaledIndex = tempLocales.findIndex(
                        (x) => x.languageId === language.id,
                    );

                    if (foundOptionLocaledIndex >= 0) {
                        tempLocales.splice(foundOptionLocaledIndex, 1, {
                            ...foundOptionLocaledItem,
                            text: value,
                        });
                    } else {
                        tempLocales.push({
                            formItemOptionId: option.id,
                            languageId: language.id,
                            languageCode: language.code,
                            text: value,
                        });
                    }

                    foundOption.locales = tempLocales;
                } else {
                    // default language

                    foundOption.value = value;
                    foundOption.text = value;
                }

                if (foundOptionIndex >= 0) {
                    tempOptions.splice(foundOptionIndex, 1, {
                        ...foundOption,
                    });
                }

                onChange([...tempOptions]);
            }
        };

    const handleClickOptionRemove = (option: FormItemOptionModel) => () => {
        if (onChange) {
            const tempOptions = (options ?? []).slice();

            const foundIndex = tempOptions.findIndex((x) => x.id === option.id);

            if (foundIndex >= 0) {
                tempOptions.splice(foundIndex, 1);

                tempOptions.forEach((item, index) => {
                    item.ordinal = index + 1;
                });

                onChange([...tempOptions]);
            }
        }
    };

    const handleClickToChangeOptionOrdinal =
        (option: FormItemOptionModel, indexToChange: number) => () => {
            if (onChange) {
                const tempOptions = (options ?? []).slice();

                const foundIndex = tempOptions.findIndex(
                    (x) => x.id === option.id,
                );

                if (foundIndex >= 0) {
                    tempOptions.splice(foundIndex, 1);
                    tempOptions.splice(indexToChange, 0, option);

                    tempOptions.forEach((item, index) => {
                        item.ordinal = index + 1;
                    });

                    onChange([...tempOptions]);
                }
            }
        };

    const handleClickTranslate = (option: FormItemOptionModel) => () => {
        if (language && language.code !== defaultLanguageCode) {
            const text = option.text;
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
                            translateToLanguageCode: language.code,
                            isHtml: false,
                            text: text,
                        },
                    })
                    .then((response) => {
                        const translatedText = response.data.text;
                        if (onChange) {
                            const tempOptions = (options ?? []).slice();
                            const foundOption = tempOptions.find(
                                (x) => x.id === option.id,
                            );
                            const foundOptionIndex = tempOptions.findIndex(
                                (x) => x.id === option.id,
                            );

                            if (
                                language &&
                                language.code !== defaultLanguageCode
                            ) {
                                const tempLocales =
                                    foundOption.locales?.slice() ?? [];

                                const foundOptionLocaledItem = tempLocales.find(
                                    (x) => x.languageId === language.id,
                                );
                                const foundOptionLocaledIndex =
                                    tempLocales.findIndex(
                                        (x) => x.languageId === language.id,
                                    );

                                if (foundOptionLocaledIndex >= 0) {
                                    tempLocales.splice(
                                        foundOptionLocaledIndex,
                                        1,
                                        {
                                            ...foundOptionLocaledItem,
                                            text: translatedText,
                                        },
                                    );
                                } else {
                                    tempLocales.push({
                                        formItemOptionId: option.id,
                                        languageId: language.id,
                                        languageCode: language.code,
                                        text: translatedText,
                                    });
                                }

                                foundOption.locales = tempLocales;
                            }

                            if (foundOptionIndex >= 0) {
                                tempOptions.splice(foundOptionIndex, 1, {
                                    ...foundOption,
                                });
                            }

                            onChange([...tempOptions]);
                        }
                    })
                    .finally(() => {
                        setTranslating((_) => false);
                    });
            }
        }
    };

    if (disabled) {
        return (
            <div>
                <span>N/A</span>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-row my-3">
                <input
                    type="text"
                    value={newOptionValue}
                    onChange={handleNewOptionValueChange}
                    placeholder="New option item"
                />
                <button
                    type="button"
                    className="button flex"
                    onClick={handleClickAddNewOption}
                >
                    Add
                </button>
            </div>
            <ul>
                {options.map((option, index, arr) => {
                    return (
                        <li
                            className="flex flex-row gap-3 my-1"
                            key={option.id}
                        >
                            <input
                                type="text"
                                value={
                                    (language &&
                                    language.code !== defaultLanguageCode
                                        ? option.locales?.find(
                                              (x) =>
                                                  x.languageId === language.id,
                                          )?.text
                                        : option.value) ?? ''
                                }
                                onChange={handleOptionChange(option)}
                            />
                            {language && language.code !== defaultLanguageCode && (
                                <button
                                    type="button"
                                    className="button flex sm"
                                    onClick={handleClickTranslate(option)}
                                    disabled={translating}
                                >
                                    Translate
                                </button>
                            )}
                            <button
                                type="button"
                                className="button flex sm"
                                title="Remove"
                                onClick={handleClickOptionRemove(option)}
                            >
                                <span className="text-sm">Remove</span>
                            </button>
                            <button
                                type="button"
                                className="button flex sm"
                                disabled={
                                    !arr || arr.length === 0 || index === 0
                                }
                                onClick={handleClickToChangeOptionOrdinal(
                                    option,
                                    index - 1,
                                )}
                            >
                                <span className="text-sm">Up</span>
                            </button>
                            <button
                                type="button"
                                className="button flex sm"
                                disabled={
                                    !arr ||
                                    arr.length === 0 ||
                                    index === arr.length - 1
                                }
                                onClick={handleClickToChangeOptionOrdinal(
                                    option,
                                    index + 1,
                                )}
                            >
                                <span className="text-sm">Down</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
