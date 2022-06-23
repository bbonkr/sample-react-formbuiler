import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useSwr from 'swr';
import {
    FormModel,
    FormsApi,
    FormsApiApiv10FormsGetFormByIdRequest,
    FormsApiApiv10FormsGetFormsRequest,
} from '../../api';
import { rootActions } from '../../store/actions';
import { FormSourceState, RootState } from '../../store/reducers';

export const useFormsApi = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API ?? '';

    const { formModel } = useSelector<RootState, FormSourceState>(
        (s) => s.sourceState,
    );

    const { formPagedModel } = useSelector<RootState, FormSourceState>(
        (s) => s.sourceState,
    );
    const { addedOrUpdatedFormId } = useSelector<RootState, FormSourceState>(
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
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
            refreshWhenHidden: false,
            // revalidateOnMount: false,
            revalidateOnReconnect: false,
            refreshWhenOffline: false,
            // revalidateIfStale: false,
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
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                return undefined;
            }
        },
    );

    const getForms = (
        page: number = 1,
        limit: number = 10,
        keyword?: string,
    ) => {
        setGetFormsOptions((_) => undefined);
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

    const addForm = (item: FormModel) => {
        dispatch(rootActions.source.setAddedOrUpdatedFormSourceId(null));

        const candidate = { ...item };

        delete candidate.items;

        client
            .apiv10FormsAddForm({
                addFormCommand: {
                    ...item,
                    title: candidate.title ?? 'No title',
                    // content: JSON.stringify(candidate, null, 4),
                    items: item.items.map((formItem) => ({
                        ...formItem,
                        id: undefined,
                        options:
                            formItem.options?.map((op) => ({
                                ...op,
                                id: undefined,
                            })) ?? [],
                    })),
                },
            })
            .then((response) => {
                const data = response.data;

                dispatch(rootActions.source.addOrUpdateFormModel(data));
                dispatch(
                    rootActions.source.setAddedOrUpdatedFormSourceId(data.id),
                );

                // const addedItem: FormSource = JSON.parse(
                //     data.content,
                // ) as FormSource;

                // if (addedItem) {
                //     addedItem.id = data.id;

                //     dispatch(rootActions.source.addOrUpdate(addedItem));
                // }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const updateForm = (item: FormModel) => {
        dispatch(rootActions.source.setAddedOrUpdatedFormSourceId(null));
        const candidate: FormModel = { ...item };

        delete candidate.items;

        client
            .apiv10FormsUpdateForm({
                updateFormCommand: {
                    ...item,
                    id: candidate.id,
                    title: candidate.title ?? 'No title',
                    // content: JSON.stringify(candidate, null, 4),
                    items: item.items.map((formItem) => ({
                        ...formItem,
                        id: undefined,
                        locales:
                            formItem.locales?.map((l) => ({
                                ...l,
                                id: undefined,
                            })) ?? [],
                        options:
                            formItem.options?.map((op) => ({
                                ...op,
                                id: undefined,
                                locales: op.locales?.map((l) => ({
                                    ...l,
                                    id: undefined,
                                })),
                            })) ?? [],
                    })),
                    locales:
                        item.locales?.map((l) => ({
                            ...l,
                            id: undefined,
                        })) ?? [],
                },
            })
            .then((response) => {
                const data = response.data;

                dispatch(rootActions.source.addOrUpdateFormModel(data));
                dispatch(
                    rootActions.source.setAddedOrUpdatedFormSourceId(data.id),
                );
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const deleteForm = (item: FormModel) => {
        client.apiv10FormsDeleteForm({ id: item.id }).then((response) => {
            console.info('deleted');
            // dispatch(rootActions.source.reomve(item));
            dispatch(rootActions.source.removeFormModel(item));
            dispatch(rootActions.source.setAddedOrUpdatedFormSourceId(''));
        });
    };

    useEffect(() => {
        if (!isLoadingGetForms && pagedFormModels) {
            dispatch(rootActions.source.setFormsPagedModel(pagedFormModels));
        }
    }, [pagedFormModels, isLoadingGetForms]);

    useEffect(() => {
        if (!isLoadingGetFormById && getFormByIdData) {
            dispatch(rootActions.source.setFormModel(getFormByIdData));
        }
    }, [getFormByIdData, isLoadingGetFormById]);

    return {
        addedOrUpdatedFormId,
        isLoadingGetForms,
        getFormsError,
        getForms,
        formPagedModel,
        formModel,
        getForm,
        addForm,
        updateForm,
        deleteForm,
    };
};
