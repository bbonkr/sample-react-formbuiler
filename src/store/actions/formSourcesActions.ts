import { ActionType, createAction } from 'typesafe-actions';
import { FormSource } from '../../components/FormRenderer/types';

const intialize = createAction('FORM_SOURCE_INITIALIZE')<
    FormSource[] | undefined | null
>();
const addOrUpdate = createAction('FORM_SOURCE_ADD_OR_UPDATE')<FormSource>();
const reomve = createAction('FORM_SOURCE_REMOVE')<FormSource>();

export const formSourceActions = { intialize, addOrUpdate, reomve };

export type FormSourceActions = ActionType<typeof formSourceActions>;
