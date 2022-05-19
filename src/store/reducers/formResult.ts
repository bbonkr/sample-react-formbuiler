import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { FormResult } from '../../components/FormRenderer';
import { rootActions, RootAction } from '../actions';
import { produce } from 'immer';

const results = createReducer<FormResult[], RootAction>([])
    .handleAction(
        [rootActions.result.intialize],
        produce((draft, action) => {
            const insertCandidate: FormResult[] = [];

            action.payload.forEach((item) => {
                const foundIndex = draft.findIndex((x) => x.id === item.id);
                if (foundIndex < 0) {
                    insertCandidate.push(item);
                }
            });

            draft.push(...insertCandidate);
            // return [...insertCandidate, ...draft];
        }),
    )
    .handleAction(
        [rootActions.result.addOrUpdate],
        produce((draft, action) => {
            const data = action.payload;

            const index = draft.findIndex((x) => x.id === data.id);

            if (index >= 0) {
                draft.splice(index, 1, data);
                // return [data, ...draft.filter((x) => x.id !== data.id)];
            } else {
                // draft.unshift(data);
                draft.push(data);
                // return [data, ...draft];
            }
        }),
    )
    .handleAction(
        [rootActions.result.reomve],
        produce((draft, action) => {
            const data = action.payload;

            const index = draft.findIndex((x) => x.id === data.id);

            if (index >= 0) {
                draft.splice(index, 1);
                // return [...draft.filter((x) => x.id !== data.id)];
            }

            // return draft;
        }),
    );

const result = createReducer<FormResult | null, RootAction>(null).handleAction(
    [rootActions.result.setCurrentResult],
    (state, action) => action.payload,
);

export const formResultState = combineReducers({ results, result });
export type FormResultState = ReturnType<typeof formResultState>;
