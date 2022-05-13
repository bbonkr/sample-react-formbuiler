import React from 'react';
import { ElementTypeItem, FormItem, FormValues } from './types';

interface RendererProps {
    item: FormItem;
    type: ElementTypeItem;
    id: string;
    values?: FormValues;
    onChange?: (item: FormItem, value: string | string[]) => void;
    // onError?: (item: FormItem, message: string) => void;
}

export const InputRenderer = ({
    item,
    type,
    id,
    values,
    onChange,
}: RendererProps) => {
    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            const currentValue = e.target.value;

            if (e.target.type === 'checkbox') {
                const checked = e.target.checked;

                const arrayValue: string[] = Array.isArray(values[item.name])
                    ? (values[item.name] as string[])
                    : [];

                const index = arrayValue.findIndex((x) => x === currentValue);

                if (checked) {
                    if (index < 0) {
                        arrayValue.push(currentValue);

                        // return [...arrayValue];
                        onChange(item, arrayValue);
                    }
                } else {
                    if (index >= 0) {
                        arrayValue.splice(index, 1);

                        // return [...arrayValue];
                        onChange(item, arrayValue);
                    }
                }
            } else {
                // setInputValue((_) => value);
                onChange(item, currentValue);

                // if (onError) {
                //     if (item.isRequired && !currentValue) {
                //         onError(item, 'Please fill this field');
                //     } else {
                //         onError(item, '');
                //     }
                // }
            }
        }
    };

    if (type.element !== 'input') {
        return <React.Fragment />;
    }

    if (type.inputType === 'checkbox' || type.inputType === 'radio') {
        return (
            <div className="flex gap-3">
                {item.options
                    ?.split(';')
                    .filter(Boolean)
                    .map((option) => {
                        return (
                            <label key={option}>
                                <input
                                    type={type.inputType}
                                    name={item.name}
                                    value={option}
                                    checked={
                                        values &&
                                        Array.isArray(values[item.name])
                                            ? values &&
                                              values[item.name].includes(option)
                                            : values &&
                                              values[item.name] === option
                                            ? true
                                            : false
                                    }
                                    required={
                                        type.inputType === 'radio' &&
                                        item.isRequired
                                            ? true
                                            : false
                                    }
                                    onChange={handleChangeValue}
                                />{' '}
                                {option}
                            </label>
                        );
                    })}
            </div>
        );
    } else {
        return (
            <input
                type={type.inputType}
                id={id}
                name={item.name}
                required={item.isRequired}
                onChange={handleChangeValue}
                value={values ? values[item.name] ?? '' : ''}
            />
        );
    }
};
