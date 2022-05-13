import { useEffect, useState } from 'react';
import { FormSource } from '../../components/FormRenderer/types';

export const useLocalStorage = () => {
    const STORAGE_KEY = 'forms';
    const [forms, setForms] = useState<FormSource[]>([]);

    useEffect(() => {
        const formsText = window.localStorage.getItem(STORAGE_KEY);
        const formData = JSON.parse(formsText) as FormSource[];

        setForms((_) => formData ?? []);
    }, []);

    const addOrUpdateFormData = (formData: FormSource) => {
        setForms((prevState) => {
            const current = prevState ?? [];
            const index = current.findIndex((x) => x.id === formData.id);

            if (index >= 0) {
                current.splice(index, 1, formData);
            } else {
                current.push(formData);
            }

            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

            return [...current];
        });
    };

    const removeFormData = (formData: FormSource) => {
        setForms((prevState) => {
            const current = prevState ?? [];
            const index = current.findIndex((x) => x.id === formData.id);

            if (index >= 0) {
                current.splice(index, 1);
                window.localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(prevState),
                );
                return [...current];
            }

            return current;
        });
    };

    return {
        forms,
        addOrUpdateFormData,
        removeFormData,
    };
};
