import { FormikErrors } from 'formik/dist/types';
import React, { useEffect, useState } from 'react';
import { InputRenderer } from './InputRenderer';
import { elementTypeItems, FormAnswer, FormItem, FormValues } from './types';

interface FormRendererProps {
    formItems?: FormItem[];
    values?: FormValues;
    errors?: FormikErrors<Partial<FormValues>>;
    readonly?: boolean;

    onEdit?: (item: FormItem) => void;
    onDelete?: (item: FormItem) => void;
    onChangeOrder?: (item: FormItem, index: number) => void;
    onChangeItemValue?: (item: FormItem, value: string | string[]) => void;
    // onErrorItemValue?: (item: FormItem, message: string) => void;
}

const FormRenderer = ({
    formItems,
    values,
    errors,
    readonly,
    onEdit,
    onDelete,
    onChangeOrder,
    onChangeItemValue,
}: // onErrorItemValue,
FormRendererProps) => {
    const [hoverId, setHoverId] = useState<string>();
    const handleMouseEnter =
        (item: FormItem) => (e: React.MouseEvent<HTMLDivElement>) => {
            setHoverId((_) => item.id);
        };

    const handleMouseLeave =
        (item: FormItem) => (e: React.MouseEvent<HTMLDivElement>) => {
            setHoverId((_) => undefined);
        };

    const handleEdit = (item: FormItem) => () => {
        if (onEdit) {
            onEdit(item);
        }
    };

    const handleDelete = (item: FormItem) => () => {
        if (onDelete) {
            onDelete(item);
        }
    };

    const handleChangeOrder = (item: FormItem, indexToChange: number) => () => {
        if (onChangeOrder) {
            onChangeOrder(item, indexToChange);
        }
    };

    const handleChangeDefault =
        (item: FormItem) =>
        (
            e:
                | React.ChangeEvent<HTMLSelectElement>
                | React.ChangeEvent<HTMLTextAreaElement>,
        ) => {
            const currentValue = e.target.value;

            if (onChangeItemValue) {
                onChangeItemValue(item, currentValue);
            }

            // if (onErrorItemValue) {
            //     if (item.isRequired && !currentValue) {
            //         onErrorItemValue(item, 'Please fill this field');
            //     } else {
            //         onErrorItemValue(item, '');
            //     }
            // }
        };

    return (
        <div className="flex flex-col gap-3">
            {formItems?.map((item, index, arr) => {
                const labelId = `${item.id}-label`;
                const controlId = `${item.id}-control`;

                const allowsUp = index > 0;
                const allowsDown = index < arr.length - 1;
                const indexToUp = index - 1;
                const indexToDown = index + 1;

                const inputTypeItem = elementTypeItems.find(
                    (x) => x.type === item.elementType,
                );

                return (
                    <div
                        className="flex flex-col relative border-2 px-4 py-2 rounded border-slate-200"
                        key={item.id}
                        onMouseEnter={handleMouseEnter(item)}
                        onMouseLeave={handleMouseLeave(item)}
                    >
                        {!readonly && (
                            <dl className="font-mono text-sm flex flex-row gap-3">
                                <dt>Id:</dt>
                                <dd>{item.id}</dd>
                                <dt>Field name:</dt>
                                <dd>{item.name}</dd>
                            </dl>
                        )}
                        <label
                            id={labelId}
                            htmlFor={controlId}
                            className="font-bold"
                        >
                            {item.label}
                            <span className="text-red-400">
                                {errors && errors[item.name]}
                            </span>
                        </label>
                        {item.isRequired && (
                            <p className="my-1 text-red-400">* Required</p>
                        )}
                        {item.description && (
                            <p className="font-thin my-1">{item.description}</p>
                        )}
                        {inputTypeItem.element === 'input' ? (
                            <InputRenderer
                                key={item.id}
                                item={item}
                                type={inputTypeItem}
                                id={controlId}
                                values={values}
                                onChange={onChangeItemValue}
                                // onError={onErrorItemValue}
                            />
                        ) : inputTypeItem.element === 'select' ? (
                            <select
                                id={controlId}
                                name={item.name}
                                required={item.isRequired}
                                onChange={handleChangeDefault(item)}
                                value={values ? values[item.name] ?? '' : ''}
                                placeholder={item.placeholder}
                            >
                                <option value="">{'Please select item'}</option>

                                {item.options
                                    ?.split(';')
                                    .filter(Boolean)
                                    .map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                            </select>
                        ) : inputTypeItem.element === 'textarea' ? (
                            <textarea
                                id={controlId}
                                name={item.name}
                                required={item.isRequired}
                                onChange={handleChangeDefault(item)}
                                value={values ? values[item.name] ?? '' : ''}
                                placeholder={item.placeholder}
                            />
                        ) : (
                            <div></div>
                        )}

                        {!readonly && (
                            <div
                                className={`flex flex-col justify-center items-center absolute top-0 left-0 right-0 bottom-0 bg-slate-500 opacity-90 ${
                                    hoverId === item.id ? '' : 'hidden'
                                }`}
                            >
                                <div className="flex flex-row gap-3 my-3">
                                    {allowsUp && (
                                        <button
                                            className="button"
                                            onClick={handleChangeOrder(
                                                item,
                                                indexToUp,
                                            )}
                                        >
                                            Up
                                        </button>
                                    )}
                                    {allowsDown && (
                                        <button
                                            className="button"
                                            onClick={handleChangeOrder(
                                                item,
                                                indexToDown,
                                            )}
                                        >
                                            Down
                                        </button>
                                    )}
                                    <button
                                        className="button"
                                        onClick={handleEdit(item)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="button danger"
                                        onClick={handleDelete(item)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default FormRenderer;
