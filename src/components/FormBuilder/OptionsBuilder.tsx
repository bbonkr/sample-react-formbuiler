import React, { useState } from 'react';
import { FormItemOptionModel } from '../../api';

interface OptionsBuilderProps {
    options?: FormItemOptionModel[];
    disabled?: boolean;
    onChange?: (options: FormItemOptionModel[]) => void;
}

export const OptionsBuilder = ({
    options,
    disabled,
    onChange,
}: OptionsBuilderProps) => {
    const [newOptionValue, setNewOptionValue] = useState<string>();

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
            if (onChange) {
                const tempOptions = (options ?? []).slice();

                const foundIndex = tempOptions.findIndex(
                    (x) => x.id === option.id,
                );

                if (foundIndex >= 0) {
                    tempOptions.splice(foundIndex, 1, {
                        ...option,
                        value: e.target.value,
                        text: e.target.value,
                    });

                    onChange([...tempOptions]);
                    console.info('[INFO] Option item Updated');
                }
            }
        };

    const handleClickOptionRemove = (option: FormItemOptionModel) => () => {
        if (onChange) {
            const tempOptions = (options ?? []).slice();

            const foundIndex = tempOptions.findIndex((x) => x.id === option.id);

            if (foundIndex >= 0) {
                tempOptions.splice(foundIndex, 1);

                onChange([...tempOptions]);
                console.info('[INFO] Option item removed');
            }
        }
    };

    const handleOptionUpClick =
        (option: FormItemOptionModel, indexToChange: number) => () => {
            updateOptionOrdinal(option, indexToChange);
        };
    const handleOptionDownClick =
        (option: FormItemOptionModel, indexToChange: number) => () => {
            updateOptionOrdinal(option, indexToChange);
        };

    const updateOptionOrdinal = (
        option: FormItemOptionModel,
        indexToChange: number,
    ) => {
        if (onChange) {
            const tempOptions = (options ?? []).slice();

            const foundIndex = tempOptions.findIndex((x) => x.id === option.id);

            if (foundIndex >= 0) {
                tempOptions.splice(foundIndex, 1);
                tempOptions.splice(indexToChange, 0, option);

                onChange([...tempOptions]);
                console.info('[INFO] Option item removed');
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
                                value={option.value}
                                onChange={handleOptionChange(option)}
                            />

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
                                onClick={handleOptionUpClick(option, index - 1)}
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
                                onClick={handleOptionUpClick(option, index + 1)}
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
