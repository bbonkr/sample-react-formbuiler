import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { rootActions, RootAction } from '../actions';
import { ResultModel, ResultModelPagedModel } from '../../api';

const results = createReducer<ResultModelPagedModel | null, RootAction>(null)
    .handleAction([rootActions.result.intialize], (_, action) => action.payload)
    .handleAction([rootActions.result.addOrUpdate], (state, action) => {
        const tempResults = state.items.slice();

        const foundIndex = tempResults.findIndex(
            (x) => x.id === action.payload.id,
        );
        if (foundIndex >= 0) {
            tempResults.splice(foundIndex, 1, action.payload);

            return {
                ...state,
                items: [...tempResults],
            };
        }

        return state;
    })
    .handleAction([rootActions.result.reomve], (state, action) => {
        const tempResults = state.items.slice();

        const foundIndex = tempResults.findIndex(
            (x) => x.id === action.payload.id,
        );
        if (foundIndex >= 0) {
            tempResults.splice(foundIndex, 1);

            return {
                ...state,
                items: [...tempResults],
            };
        }

        return state;
    });

const result = createReducer<ResultModel | null, RootAction>(null).handleAction(
    [rootActions.result.setCurrentResult],
    (_, action) => action.payload,
);

export const formResultState = combineReducers({ results, result });
export type FormResultState = ReturnType<typeof formResultState>;
