import { useDispatch, useSelector } from 'react-redux';
import {
    ResultModel,
    ResultsApi,
    ResultsApiApiv10ResultsAddResultRequest,
    ResultsApiApiv10ResultsGetResultByIdRequest,
    ResultsApiApiv10ResultsGetResultsRequest,
} from '../../api';
import { FormResultState, RootState } from '../../store/reducers';
import useSwr from 'swr';
import { useEffect, useState } from 'react';
import { rootActions } from '../../store/actions';

interface UseResultsApiProps {
    addResultCallback?: (result: ResultModel) => void;
}

export const useResultsApi = (props?: UseResultsApiProps) => {
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
            getResultsOptions.formId ?? '',
        ],
        (_, page, limit, formId) => {
            return client
                .apiv10ResultsGetResults({
                    page,
                    limit,
                    formId: formId ? formId : undefined,
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

    const getResults = (
        page: number = 1,
        limit: number = 10,
        formId?: string,
    ) => {
        setGetResultsOptions((prevState) => ({
            ...prevState,
            page,
            limit,
            formId,
        }));
    };

    const getResult = (id: string) => {
        setGetResultByIdOptions((prevState) => ({ id: id }));
    };

    const addResult = (item: ResultModel) => {
        const serialized = JSON.stringify(item, null, 4);
        client
            .apiv10ResultsAddResult({
                addResultCommand: {
                    formId: item.formId,
                    content: serialized,
                    items: [...item.items],
                },
            })
            .then((response) => {
                const responseData = response.data;
                dispatch(rootActions.result.addOrUpdate(responseData));

                if (props && props.addResultCallback) {
                    props.addResultCallback(responseData);
                }
            })
            .catch((e) => {
                console.warn(e);
            });
    };

    useEffect(() => {
        if (!isLoadingGetResults && getResultsResponseData) {
            dispatch(rootActions.result.intialize(getResultsResponseData));
        }
    }, [getResultsResponseData, isLoadingGetResults]);

    useEffect(() => {
        if (!isLoadingGetResultById && getResultByIdResponseData) {
            dispatch(
                rootActions.result.setCurrentResult(getResultByIdResponseData),
            );
        }
    }, [getResultByIdResponseData, isLoadingGetResultById]);

    return {
        results,
        result,
        getResultsOptions,
        getResults,
        getResult,
        addResult,
    };
};
