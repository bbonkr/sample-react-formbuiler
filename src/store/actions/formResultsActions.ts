import { ActionType, createAction } from 'typesafe-actions';
import { FormResult } from '../../components/FormRenderer/types';

const intialize = createAction('FORM_RESULT_INITIALIZE')<
    FormResult[] | undefined | null
>();
const addOrUpdate = createAction('FORM_RESULT_ADD_OR_UPDATE')<FormResult>();
const reomve = createAction('FORM_RESULT_REMOVE')<FormResult>();

export const formResultActions = { intialize, addOrUpdate, reomve };

export type FormResultActions = ActionType<typeof formResultActions>;
