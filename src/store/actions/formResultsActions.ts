import { ActionType, createAction } from 'typesafe-actions';
import { FormResult } from '../../components/FormRenderer/types';

const intialize = createAction('FORM_RESULT_INITIALIZE')<
    FormResult[] | undefined | null
>();
const addOrUpdate = createAction('FORM_RESULT_ADD_OR_UPDATE')<FormResult>();
const reomve = createAction('FORM_RESULT_REMOVE')<FormResult>();

const setCurrentResult = createAction(
    'FORM_CURRENT_RESULT',
)<FormResult | null>();

export const formResultActions = {
    intialize,
    addOrUpdate,
    reomve,
    setCurrentResult,
};

export type FormResultActions = ActionType<typeof formResultActions>;
