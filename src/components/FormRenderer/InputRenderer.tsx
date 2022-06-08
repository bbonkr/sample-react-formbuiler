import React, { useEffect, useState } from 'react';
import { FilesApi, FormItemModel, UploadFileMediaModel } from '../../api';
import { ElementTypeItem, FormValues } from './types';

interface RendererProps {
    item: FormItemModel;
    type: ElementTypeItem;
    id: string;
    values?: FormValues;
    onChange?: (item: FormItemModel, value: string | string[]) => void;
    // onError?: (item: FormItem, message: string) => void;
}

export const InputRenderer = ({
    item,
    type,
    id,
    values,
    onChange,
}: RendererProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_API;
    const [files, setFiles] = useState<UploadFileMediaModel[]>([]);

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
            } else if (e.target.type === 'file') {
                // console.info('files', e.target.files);
                const client = new FilesApi(undefined, baseUrl);

                // const files: File[] = [];
                // Array.prototype.forEach.call(e.target.files, (item) => {
                //     console.info('file', item);
                //     files.push(item);
                //     // formData.append('files', item);
                // });

                client
                    .apiv10FilesUpload({
                        files: Array.from(e.target.files),
                    })
                    .then((response) => {
                        setFiles((prevState) => {
                            const tempState = prevState.slice();

                            response.data.forEach((item) => {
                                tempState.push(item);
                            });
                            return [...tempState];
                        });
                    });
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

    const handleClickDeleteFile = (file: UploadFileMediaModel) => () => {
        const client = new FilesApi(undefined, baseUrl);
        client
            .apiv10FilesDelete({
                deleteFileCommand: {
                    uri: file.uriForDeletion,
                },
            })
            .then((response) => {
                setFiles((prevState) => {
                    const tempArray = prevState.slice();
                    const deletedIndex = tempArray.findIndex(
                        (x) => x.name === file.name,
                    );
                    if (deletedIndex >= 0) {
                        tempArray.splice(deletedIndex, 1);
                        return [...tempArray];
                    }

                    return prevState;
                });
            });
    };

    useEffect(() => {
        if (onChange) {
            onChange(
                item,
                files.map((x) => x.uri),
            );
        }
    }, [files]);

    if (type.element !== 'input') {
        return <React.Fragment />;
    }

    if (type.inputType === 'checkbox' || type.inputType === 'radio') {
        return (
            <div className="flex gap-3">
                {item.options?.map((option) => {
                    return (
                        <label key={option.id}>
                            <input
                                type={type.inputType}
                                name={item.name}
                                value={option.value}
                                checked={
                                    values && Array.isArray(values[item.name])
                                        ? values &&
                                          values[item.name].includes(
                                              option.value,
                                          )
                                        : values &&
                                          values[item.name] === option.value
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
                            {option.text}
                        </label>
                    );
                })}
            </div>
        );
    } else {
        return (
            <React.Fragment>
                <input
                    type={type.inputType}
                    id={id}
                    name={item.name}
                    required={item.isRequired}
                    onChange={handleChangeValue}
                    value={
                        values && item.elementType !== 'File'
                            ? values[item.name] ?? ''
                            : ''
                    }
                    placeholder={item.placeholder}
                />

                {files && files.length > 0 && (
                    <ul>
                        {files.map((file) => {
                            return (
                                <li key={file.uri}>
                                    {file.name}
                                    <button
                                        type="button"
                                        onClick={handleClickDeleteFile(file)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </React.Fragment>
        );
    }
};
