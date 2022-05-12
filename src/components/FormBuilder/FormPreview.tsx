import React, { useEffect, useState } from 'react';
import { ElementTypeItem, elementTypeItems, FormItem } from './types';

interface FormPreviewProps {
    formItems?: FormItem[];
    onEdit?: (item: FormItem) => void;
    onDelete?: (item: FormItem) => void;
}

interface RendererProps {
    item: FormItem;
    type: ElementTypeItem;
    id: string;
}

const InputRenderer = ({ item, type, id }: RendererProps) => {
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
                                />{' '}
                                {option}
                            </label>
                        );
                    })}
            </div>
        );
    } else {
        return <input type={type.inputType} id={id} name={item.name} />;
    }
};

const FormPreview = ({ formItems, onEdit, onDelete }: FormPreviewProps) => {
    const [hoverId, setHoverId] = useState<string>();
    const handleMouseEnter =
        (item: FormItem) => (e: React.MouseEvent<HTMLDivElement>) => {
            console.info(item.id);
            setHoverId((_) => item.id);
        };

    const handleMouseLeave =
        (item: FormItem) => (e: React.MouseEvent<HTMLDivElement>) => {
            console.info(item.id);
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

    return (
        <div className="flex flex-col gap-3">
            {formItems?.map((item) => {
                const labelId = `${item.id}-label`;
                const controlId = `${item.id}-control`;

                const inputTypeItem = elementTypeItems.find(
                    (x) => x.type === item.elementType,
                );

                return (
                    <div
                        className="flex flex-col relative"
                        key={item.id}
                        onMouseEnter={handleMouseEnter(item)}
                        onMouseLeave={handleMouseLeave(item)}
                    >
                        <label
                            id={labelId}
                            htmlFor={controlId}
                            className="font-bold"
                        >
                            {item.label}
                        </label>
                        {item.description && (
                            <p className="font-thin my-1">{item.description}</p>
                        )}
                        {inputTypeItem.element === 'input' ? (
                            <InputRenderer
                                key={item.id}
                                item={item}
                                type={inputTypeItem}
                                id={controlId}
                            />
                        ) : inputTypeItem.element === 'select' ? (
                            <select id={controlId} name={item.name}>
                                {!item.isRequired && (
                                    <option value="">
                                        {'Please select item'}
                                    </option>
                                )}
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
                            <textarea id={controlId} name={item.name} />
                        ) : (
                            <div></div>
                        )}

                        <div
                            className={`flex flex-col justify-center items-center absolute top-0 left-0 right-0 bottom-0 bg-slate-500 opacity-90 ${
                                hoverId === item.id ? '' : 'hidden'
                            }`}
                        >
                            <div className="flex flex-row gap-3 my-3">
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
                    </div>
                );
            })}
        </div>
    );
};

export default FormPreview;
