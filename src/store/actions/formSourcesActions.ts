import { ActionType, createAction } from 'typesafe-actions';
import { FormSource } from '../../components/FormRenderer/types';

const intialize = createAction('FORM_SOURCE_INITIALIZE')<
    FormSource[] | undefined | null
>();
const addOrUpdate = createAction('FORM_SOURCE_ADD_OR_UPDATE')<FormSource>();
const reomve = createAction('FORM_SOURCE_REMOVE')<FormSource>();

const setAddedOrUpdatedFormSourceId = createAction(
    'FORM_SOURCE_ADDED_OR_UPDATED_ID',
)<string | null>();

const setCurrentForm = createAction('FORM_CURRENT_FORM')<FormSource | null>();

export const formSourceActions = {
    intialize,
    addOrUpdate,
    reomve,
    setCurrentForm,
    setAddedOrUpdatedFormSourceId,
};

export type FormSourceActions = ActionType<typeof formSourceActions>;
