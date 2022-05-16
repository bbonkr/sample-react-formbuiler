import { useEffect } from 'react';
import { FormResult, FormSource } from '../../components/FormRenderer/types';
import { useSelector, useDispatch } from 'react-redux';
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

    // const [forms, setForms] = useState<FormSource[]>([]);
    // const [results, setResults] = useState<FormResult[]>([]);

    const { forms } = useSelector<RootState, FormSourceState>(
        (s) => s.sourceState,
    );
    const { results } = useSelector<RootState, FormResultState>(
        (s) => s.resultState,
    );

    useEffect(() => {
        const formsText = window.localStorage.getItem(STORAGE_KEY_FORMS);
        const formData = JSON.parse(formsText) as FormSource[];

        const formResultsText =
            window.localStorage.getItem(STORAGE_KEY_RESULTS);
        const formResults = JSON.parse(formResultsText) as FormResult[];

        // setForms((_) => formData ?? []);
        // setResults((_) => formResults ?? []);

        dispatch(rootActions.source.intialize(formData ?? []));
        dispatch(rootActions.result.intialize(formResults ?? []));
    }, []);

    const bulkImport = (records: FormSource[]) => {
        dispatch(rootActions.source.intialize(records ?? []));
    };

    const addOrUpdateFormData = (formData: FormSource) => {
        // setForms((prevState) => {
        //     const current = prevState ?? [];
        //     const index = current.findIndex((x) => x.id === formData.id);

        //     if (index >= 0) {
        //         current.splice(index, 1, formData);
        //     } else {
        //         current.push(formData);
        //     }
        //     return [...current];
        // });
        dispatch(rootActions.source.addOrUpdate(formData));
    };

    const removeFormData = (formData: FormSource) => {
        // setForms((prevState) => {
        //     const current = prevState ?? [];
        //     const index = current.findIndex((x) => x.id === formData.id);

        //     if (index >= 0) {
        //         current.splice(index, 1);

        //         return [...current];
        //     }

        //     return current;
        // });
        dispatch(rootActions.source.reomve(formData));
    };

    const addOrUpdateFormResult = (data: FormResult) => {
        // setResults((prevState) => {
        //     const current = prevState ?? [];
        //     const index = current.findIndex((x) => x.id === data.id);

        //     if (index >= 0) {
        //         current.splice(index, 1, data);
        //     } else {
        //         current.push(data);
        //     }

        //     return [...current];
        // });
        dispatch(rootActions.result.addOrUpdate(data));
    };

    const removeFormResult = (data: FormResult) => {
        // setResults((prevState) => {
        //     const current = prevState ?? [];
        //     const index = current.findIndex((x) => x.id === data.id);

        //     if (index >= 0) {
        //         current.splice(index, 1);

        //         return [...current];
        //     }

        //     return current;
        // });

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
