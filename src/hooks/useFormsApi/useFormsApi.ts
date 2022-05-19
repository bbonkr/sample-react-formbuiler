import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useSwr from 'swr';
import {
    FormsApi,
    FormsApiApiv10FormsGetFormByIdRequest,
    FormsApiApiv10FormsGetFormsRequest,
} from '../../api';
import { FormSource } from '../../components/FormRenderer';
import { rootActions } from '../../store/actions';
import { FormSourceState, RootState } from '../../store/reducers';

export const useFormsApi = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API ?? '';
    const { forms } = useSelector<RootState, FormSourceState>(
        (s) => s.sourceState,
    );
    const { addedOrUpdatedFormId } = useSelector<RootState, FormSourceState>(
        (s) => s.sourceState,
    );
    const { form } = useSelector<RootState, FormSourceState>(
        (s) => s.sourceState,
    );
    const client = new FormsApi(undefined, baseUrl);
    const dispatch = useDispatch();

    const [getFormsOptions, setGetFormsOptions] =
        useState<FormsApiApiv10FormsGetFormsRequest>({
            page: 1,
            limit: 10,
            keyword: '',
        });
    const [getFormByIdOptions, setGetFormByIdOptions] =
        useState<FormsApiApiv10FormsGetFormByIdRequest>();

    const {
        data: pagedFormModels,
        isValidating: isLoadingGetForms,
        error: getFormsError,
    } = useSwr(
        [
            `/api/forms?page=${getFormsOptions.page}&limit=${
                getFormsOptions.limit
            }&keyword=${encodeURIComponent(getFormsOptions.keyword ?? '')}`,
            getFormsOptions.page ?? 1,
            getFormsOptions.limit ?? 10,
            getFormsOptions.keyword,
        ],
        (_, page, limit, keyword) => {
            return client
                .apiv10FormsGetForms({
                    page: page,
                    limit: limit,
                    keyword: keyword,
                })
                .then((response) => {
                    return response.data;
                });
        },
    );

    const {
        data: getFormByIdData,
        isValidating: isLoadingGetFormById,
        error: getFormByIdError,
    } = useSwr(
        [`/api/forms/${getFormByIdOptions?.id}`, getFormByIdOptions?.id],
        (_, id) => {
            if (id) {
                return client
                    .apiv10FormsGetFormById({ id })
                    .then((response) => {
                        return response.data;
                    });
            } else {
                return undefined;
            }
        },
    );

    const getForms = (page: number, limit: number = 10, keyword?: string) => {
        setGetFormsOptions((prevState) => ({
            ...prevState,
            page,
            limit,
            keyword,
        }));
    };

    const getForm = (id: string) => {
        if (id) {
            setGetFormByIdOptions((prevState) => ({
                ...prevState,
                id,
            }));
        }
    };

    const addForm = (item: FormSource) => {
        dispatch(rootActions.source.setAddedOrUpdatedFormSourceId(null));

        const candidate = { ...item };

        client
            .apiv10FormsAddForm({
                addFormCommand: {
                    title: candidate.title ?? 'No title',
                    content: JSON.stringify(candidate, null, 4),
                },
            })
            .then((response) => {
                const data = response.data;
                const addedItem: FormSource = JSON.parse(
                    data.content,
                ) as FormSource;

                if (addedItem) {
                    addedItem.id = data.id;

                    dispatch(rootActions.source.addOrUpdate(addedItem));
                    dispatch(
                        rootActions.source.setAddedOrUpdatedFormSourceId(
                            addedItem.id,
                        ),
                    );
                }
            });
    };

    const updateForm = (item: FormSource) => {
        dispatch(rootActions.source.setAddedOrUpdatedFormSourceId(null));
        const candidate = { ...item };

        client
            .apiv10FormsUpdateForm({
                updateFormCommand: {
                    id: candidate.id,
                    title: candidate.title ?? 'No title',
                    content: JSON.stringify(candidate, null, 4),
                },
            })
            .then((response) => {
                const data = response.data;
                const updatedItem: FormSource = JSON.parse(
                    data.content,
                ) as FormSource;

                if (updatedItem) {
                    updatedItem.id = data.id;

                    dispatch(rootActions.source.addOrUpdate(updatedItem));
                    dispatch(
                        rootActions.source.setAddedOrUpdatedFormSourceId(
                            updatedItem.id,
                        ),
                    );
                }
            });
    };

    const deleteForm = (item: FormSource) => {
        client.apiv10FormsDeleteForm({ id: item.id }).then((response) => {
            console.info('deleted');
            dispatch(rootActions.source.reomve(item));
        });
    };

    useEffect(() => {
        if (!isLoadingGetForms && pagedFormModels) {
            const formSources = pagedFormModels.items.map((x) => {
                console.info('x.content:', x.content);

                const formSource: FormSource = JSON.parse(
                    x.content,
                ) as FormSource;
                formSource.id = x.id;
                formSource.title = x.title;
                return formSource;
            });

            dispatch(rootActions.source.intialize(formSources ?? []));
        }
    }, [pagedFormModels, isLoadingGetForms]);

    useEffect(() => {
        if (!isLoadingGetFormById && getFormByIdData) {
            const formSource: FormSource = JSON.parse(
                getFormByIdData.content,
            ) as FormSource;

            if (formSource) {
                formSource.id = getFormByIdData.id;
                formSource.title = getFormByIdData.title;

                dispatch(rootActions.source.setCurrentForm(formSource));
            }
        }
    }, [getFormByIdData, isLoadingGetFormById]);

    return {
        addedOrUpdatedFormId,
        forms,
        isLoadingGetForms,
        getFormsError,
        getForms,
        form,
        getForm,
        addForm,
        updateForm,
        deleteForm,
    };
};
