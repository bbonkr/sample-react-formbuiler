import { useEffect } from 'react';
import { FormResult, FormSource } from '../../components/FormRenderer/types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
    FormResultState,
    FormSourceState,
    RootState,
} from '../../store/reducers';
import { rootActions } from '../../store/actions';

export const useLocalStorage = () => {
    const dispatch = useDispatch();

    const STORAGE_KEY_FORMS = 'forms';
    const STORAGE_KEY_RESULTS = 'results';

    const { forms } = useSelector<RootState, FormSourceState>(
        (s) => s.sourceState,
        shallowEqual,
    );
    const { results } = useSelector<RootState, FormResultState>(
        (s) => s.resultState,
        shallowEqual,
    );

    useEffect(() => {
        const formsText = window.localStorage.getItem(STORAGE_KEY_FORMS);
        const formData = JSON.parse(formsText) as FormSource[];

        const formResultsText =
            window.localStorage.getItem(STORAGE_KEY_RESULTS);
        const formResults = JSON.parse(formResultsText) as FormResult[];

        dispatch(rootActions.source.intialize(formData ?? []));
        dispatch(rootActions.result.intialize(formResults ?? []));
    }, []);

    const bulkImport = (records: FormSource[]) => {
        dispatch(rootActions.source.intialize(records ?? []));
    };

    const addOrUpdateFormData = (formData: FormSource) => {
        dispatch(rootActions.source.addOrUpdate(formData));
    };

    const removeFormData = (formData: FormSource) => {
        dispatch(rootActions.source.reomve(formData));
    };

    const addOrUpdateFormResult = (data: FormResult) => {
        dispatch(rootActions.result.addOrUpdate(data));
    };

    const removeFormResult = (data: FormResult) => {
        dispatch(rootActions.result.reomve(data));
    };

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY_FORMS, JSON.stringify(forms));
    }, [forms]);

    useEffect(() => {
        window.localStorage.setItem(
            STORAGE_KEY_RESULTS,
            JSON.stringify(results),
        );
    }, [results]);

    return {
        forms,
        results,
        bulkImport,
        addOrUpdateFormData,
        removeFormData,
        addOrUpdateFormResult,
        removeFormResult,
    };
};
