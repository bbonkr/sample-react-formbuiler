import { ActionType, createAction } from 'typesafe-actions';
import { FormModel, FormModelPagedModel } from '../../api';
// import { FormSource } from '../../components/FormRenderer/types';

// const intialize = createAction('FORM_SOURCE_INITIALIZE')<
//     FormSource[] | undefined | null
// >();
// const addOrUpdate = createAction('FORM_SOURCE_ADD_OR_UPDATE')<FormSource>();
// const reomve = createAction('FORM_SOURCE_REMOVE')<FormSource>();
const setAddedOrUpdatedFormSourceId = createAction(
    'FORM_SOURCE_ADDED_OR_UPDATED_ID',
)<string | null>();

// const setCurrentForm = createAction('FORM_CURRENT_FORM')<FormSource | null>();

const setFormsPagedModel = createAction(
    'SET_FORMS_PAGED_MODEL',
)<FormModelPagedModel | null>();
const addOrUpdateFormModel = createAction(
    'FORM_MODEL_ADD_OR_UPDATE',
)<FormModel | null>();
const removeFormModel = createAction('REMOVE_FORM_MODEL')<FormModel>();
const setFormModel = createAction('FORM_MODEL_SET')<FormModel | null>();

export const formSourceActions = {
    // intialize,
    // addOrUpdate,
    // reomve,
    // setCurrentForm,
    setAddedOrUpdatedFormSourceId,
    setFormsPagedModel,
    addOrUpdateFormModel,
    removeFormModel,
    setFormModel,
};

export type FormSourceActions = ActionType<typeof formSourceActions>;
