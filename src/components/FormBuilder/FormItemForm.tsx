import React from 'react';
import { ElementTypes, FormItemModel, FormItemOptionModel } from '../../api';
import type { FieldInputProps, FormikErrors } from 'formik/dist/types';
import { OptionsBuilder } from './OptionsBuilder';
import { elementTypeItems } from '../FormRenderer/types';

interface FormItemFormProps {
    values?: Partial<FormItemModel>;
    errors: FormikErrors<Partial<FormItemModel>>;
    isValid?: boolean;
    getFieldProps: (nameOrOptions: any) => FieldInputProps<any>;
    onSubmit?: (e?: React.FormEvent<HTMLFormElement>) => void;
    onReset?: (e: React.FormEvent<HTMLFormElement>) => void;
    onChangeName?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeOptionBuilder?: (options: FormItemOptionModel[]) => void;
    onChangeElementType?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const FormItemForm = ({
    values,
    errors,
    isValid,
    getFieldProps,
    onSubmit,
    onReset,
    onChangeName,
    onChangeOptionBuilder,
    onChangeElementType,
}: FormItemFormProps) => {
    return (
        <form
            onSubmit={onSubmit}
            onReset={onReset}
            className="flex flex-col gap-3"
        >
            <input
                type="hidden"
                {...getFieldProps('id')}
                value={values?.id ?? ''}
            />
            <div className="flex flex-col">
                <label>
                    Type:
                    <span className="text-red-500"> {errors.elementType}</span>
                </label>
                <select
                    {...getFieldProps('elementType')}
                    onChange={onChangeElementType}
                    value={values?.elementType ?? ''}
                >
                    <option value="">Please select element type</option>
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
                    <span className="text-red-500"> {errors.label}</span>
                </label>
                <input
                    type="text"
                    className="form-input"
                    {...getFieldProps('label')}
                    value={values?.label ?? ''}
                />
            </div>

            <div className="flex flex-col">
                <label>
                    Placeholder:
                    <span className="text-red-500"> {errors.placeholder}</span>
                </label>
                <input
                    type="text"
                    className="form-input"
                    {...getFieldProps('placeholder')}
                    value={values?.placeholder ?? ''}
                />
            </div>

            <div className="flex flex-col">
                <label>Description:</label>
                <textarea
                    {...getFieldProps('description')}
                    value={values?.description ?? ''}
                />
            </div>
            <div className="flex flex-col">
                <label>
                    Name:
                    <span className="text-red-500"> {errors.name}</span>
                </label>
                <input
                    type="text"
                    {...getFieldProps('name')}
                    onChange={onChangeName}
                    value={values?.name ?? ''}
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
                <OptionsBuilder
                    options={values?.options ?? []}
                    disabled={
                        ![
                            ElementTypes.Select,
                            ElementTypes.Checkbox,
                            ElementTypes.Radio,
                        ].includes(values?.elementType)
                    }
                    onChange={onChangeOptionBuilder}
                />
                {/* <input
                                type="text"
                                className="form-input"
                                {...getFieldProps('options')}
                                value={
                                    values.options
                                        ?.map((option) => option?.value)
                                        .join(';') ?? ''
                                }
                                disabled={
                                    ![
                                        ElementTypes.Select,
                                        ElementTypes.Checkbox,
                                        ElementTypes.Radio,
                                    ].includes(values.elementType)
                                }
                                readOnly={
                                    ![
                                        ElementTypes.Select,
                                        ElementTypes.Checkbox,
                                        ElementTypes.Radio,
                                    ].includes(values.elementType)
                                }
                            /> */}
            </div>
            <div className="flex flex-col">
                <label className="">Required:</label>
                <label className="checkbox">
                    <input
                        className="form-control"
                        type="checkbox"
                        {...getFieldProps('isRequired')}
                        checked={values?.isRequired ?? false}
                        disabled={values?.elementType === 'Radio'}
                    />
                    {' This field is required'}
                </label>
            </div>
            <div className="flex flex-row justify-center items-stretch my-6">
                {values?.id && (
                    <button className="button flex-1" type="reset">
                        Reset
                    </button>
                )}
                <button
                    className="button primary flex-1"
                    type="submit"
                    disabled={!isValid}
                >
                    {values?.id ? 'Update' : 'Add'} Field
                </button>
            </div>
        </form>
    );
};
