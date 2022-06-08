import React, { useState } from 'react';
import { useFormik } from 'formik';
import FormRenderer from '../FormRenderer/FormRenderer';
import { FormAnswer, FormResult } from '../FormRenderer/types';
// import { useLocalStorage } from '../../hooks/useLocalStorage';
import { string } from 'yup';
import { useResultsApi } from '../../hooks/useResultsApi';
import { FormItemModel, FormModel } from '../../api';

interface FormViewerProps {
    record: FormModel;
}

type FormValues = Record<string, string | string[]>;

const FormViewer = ({ record }: FormViewerProps) => {
    // const { addOrUpdateFormResult } = useLocalStorage();
    const { addResult } = useResultsApi();

    const [result, setResult] = useState<FormResult>();

    const validateItem = (
        item: FormItemModel,
        value?: string | string[],
    ): boolean => {
        if (item.isRequired) {
            if (typeof value === 'string' && !value) {
                setFieldError(item.name, 'Please enter the answer.');
                return false;
            }

            if (
                item.elementType === 'Checkbox' &&
                (!value || value.length === 0)
            ) {
                setFieldError(item.name, 'Please choose least one item.');
                return false;
            }
        }

        if (item.elementType === 'Email') {
            const validator = string().email();
            try {
                validator.validateSync(value);
            } catch (e) {
                setFieldError(item.name, 'Please input valid email format.');
            }
        }

        return true;
    };

    const validateFormValues = (
        source: FormModel,
        values: FormValues,
    ): boolean => {
        let isVaild = true;
        source.items?.forEach((item) => {
            // console.info('validateFormValues', values[item.name]);
            const valid = validateItem(item, values[item.name]);
            isVaild = isVaild && valid;
        });

        return isVaild;
    };

    const { values, errors, handleSubmit, setValues, setFieldError, isValid } =
        useFormik<FormValues>({
            initialValues: {},
            enableReinitialize: true,
            initialErrors: {},
            onSubmit: async (v, helper) => {
                const isValid = validateFormValues(record, v);
                if (isValid) {
                    const result: FormResult = {
                        id: `${+new Date()}`,
                        formId: record.id,
                        items: record?.items?.map((item) => {
                            const answer: FormAnswer = {
                                ...item,
                                answers: v[item.name],
                            };

                            return answer;
                        }),
                    };

                    setResult((_) => result);

                    addResult(result);
                }
            },
        });

    const handleChangeItemValue = (
        item: FormItemModel,
        value: string | string[],
    ) => {
        setValues(
            {
                ...values,
                [item.name]: value,
            },
            true,
        ).then(() => {
            validateItem(item, value);
        });
    };

    return (
        <div>
            <h1>{record.id}</h1>
            <div className="flex flex-row justify-center items-stretch gap-3">
                <div className="flex flex-col py-3 flex-1">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col justify-center items-stretch gap-6"
                    >
                        <FormRenderer
                            formItems={record.items}
                            values={values}
                            errors={errors}
                            readonly
                            onChangeItemValue={handleChangeItemValue}
                        />

                        <button
                            type="submit"
                            className="button primary"
                            disabled={!isValid}
                        >
                            Submit
                        </button>
                    </form>
                </div>

                <div className="flex flex-col flex-1 gap-3">
                    <div>
                        <h3>Form Values:</h3>
                        <pre className="break-words whitespace-pre-wrap">
                            {JSON.stringify(values, null, 4)}
                        </pre>
                    </div>
                    <div>
                        <h3>Submit data:</h3>
                        <pre className="break-words whitespace-pre-wrap">
                            {JSON.stringify(result, null, 4)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormViewer;
