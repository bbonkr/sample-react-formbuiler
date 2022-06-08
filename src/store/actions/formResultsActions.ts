import { ActionType, createAction } from 'typesafe-actions';
import { ResultModel, ResultModelPagedModel } from '../../api';

const intialize = createAction('FORM_RESULT_INITIALIZE')<
    ResultModelPagedModel | undefined | null
>();
const addOrUpdate = createAction('FORM_RESULT_ADD_OR_UPDATE')<ResultModel>();
const reomve = createAction('FORM_RESULT_REMOVE')<ResultModel>();

const setCurrentResult = createAction(
    'FORM_CURRENT_RESULT',
)<ResultModel | null>();

export const formResultActions = {
    intialize,
    addOrUpdate,
    reomve,
    setCurrentResult,
};

export type FormResultActions = ActionType<typeof formResultActions>;
