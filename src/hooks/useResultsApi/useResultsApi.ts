import { useDispatch, useSelector } from 'react-redux';
import {
    ResultsApi,
    ResultsApiApiv10ResultsAddResultRequest,
    ResultsApiApiv10ResultsGetResultByIdRequest,
    ResultsApiApiv10ResultsGetResultsRequest,
} from '../../api';
import { FormResultState, RootState } from '../../store/reducers';
import useSwr from 'swr';
import { useEffect, useState } from 'react';
import { FormResult } from '../../components/FormRenderer';
import { rootActions } from '../../store/actions';

export const useResultsApi = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API ?? '';
    const { results } = useSelector<RootState, FormResultState>(
        (s) => s.resultState,
    );
    const { result } = useSelector<RootState, FormResultState>(
        (s) => s.resultState,
    );
    const client = new ResultsApi(undefined, baseUrl);
    const dispatch = useDispatch();

    const [getResultsOptions, setGetResultsOptions] =
        useState<ResultsApiApiv10ResultsGetResultsRequest>({
            page: 1,
            limit: 10,
        });

    const [getResultByIdOptions, setGetResultByIdOptions] =
        useState<ResultsApiApiv10ResultsGetResultByIdRequest>();

    const {
        data: getResultsResponseData,
        isValidating: isLoadingGetResults,
        error: getResultsError,
    } = useSwr(
        [
            `/api/results?page=${getResultsOptions.page}&limit=${getResultsOptions.limit}`,
            getResultsOptions.page ?? 1,
            getResultsOptions.limit ?? 10,
        ],
        (_, page, limit) => {
            return client
                .apiv10ResultsGetResults({
                    page: page,
                    limit: limit,
                })
                .then((response) => {
                    return response.data;
                });
        },
    );

    const {
        data: getResultByIdResponseData,
        isValidating: isLoadingGetResultById,
        error: getResultByIdError,
    } = useSwr(
        [`/api/results/${getResultByIdOptions?.id}`, getResultByIdOptions?.id],
        (_, id) => {
            if (id) {
                return client
                    .apiv10ResultsGetResultById({ id })
                    .then((response) => {
                        return response.data;
                    });
            } else {
                return undefined;
            }
        },
    );

    const getResults = (page: number = 1, limit: number = 10) => {
        setGetResultsOptions((prevState) => ({
            ...prevState,
            page,
            limit,
        }));
    };

    const getResult = (id: string) => {
        setGetResultByIdOptions((prevState) => ({ id: id }));
    };

    const addResult = (item: FormResult) => {
        const serialized = JSON.stringify(item, null, 4);
        client
            .apiv10ResultsAddResult({
                addResultCommand: {
                    formId: item.formId,
                    content: serialized,
                },
            })
            .then((response) => {
                const added = JSON.parse(response.data.content) as FormResult;
                if (added) {
                    added.id = response.data.id;
                    added.formId = response.data.formId;

                    dispatch(rootActions.result.addOrUpdate(added));
                }
            });
    };

    useEffect(() => {
        if (!isLoadingGetResults && getResultsResponseData) {
            const formResults = getResultsResponseData?.items.map((x) => {
                const formResult: FormResult = JSON.parse(
                    x.content,
                ) as FormResult;

                formResult.id = x.id;

                return formResult;
            });

            dispatch(rootActions.result.intialize(formResults ?? []));
        }
    }, [getResultsResponseData, isLoadingGetResults]);

    useEffect(() => {
        if (!isLoadingGetResultById && getResultByIdResponseData) {
            const formResult: FormResult = JSON.parse(
                getResultByIdResponseData.content,
            ) as FormResult;

            if (formResult) {
                formResult.id = getResultByIdResponseData.id;
                formResult.formId = getResultByIdResponseData.form.id;

                dispatch(rootActions.result.setCurrentResult(formResult));
            }
        }
    }, [getResultByIdResponseData, isLoadingGetResultById]);

    return {
        results,
        result,
        getResults,
        getResult,
        addResult,
    };
};
