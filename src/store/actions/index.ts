import { ActionType } from 'typesafe-actions';
import { formResultActions } from './formResultsActions';
import { formSourceActions } from './formSourcesActions';

export type { FormResultActions } from './formResultsActions';
export type { FormSourceActions } from './formSourcesActions';

export const rootActions = {
    result: formResultActions,
    source: formSourceActions,
};

export type RootAction = ActionType<typeof rootActions>;
