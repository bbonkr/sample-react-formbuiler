import { combineReducers } from 'redux';
import { formResultState } from './formResult';
import { formSourceState } from './formSource';

export type { FormResultState } from './formResult';
export type { FormSourceState } from './formSource';

const rootState = combineReducers({
    resultState: formResultState,
    sourceState: formSourceState,
});

export type RootState = ReturnType<typeof rootState>;

export default rootState;
