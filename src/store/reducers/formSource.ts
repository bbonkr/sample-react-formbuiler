import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
// import { FormSource } from '../../components/FormRenderer';
import { rootActions, RootAction } from '../actions';
import { produce } from 'immer';
import { FormModel, FormModelPagedModel } from '../../api';

// const forms = createReducer<FormSource[], RootAction>([])
//     .handleAction(
//         [rootActions.source.intialize],
//         produce((draft, action) => {
//             const insertCandidate: FormSource[] = [];
//             action.payload.forEach((item) => {
//                 const foundIndex = draft.findIndex((x) => x.id === item.id);
//                 if (foundIndex < 0) {
//                     insertCandidate.push(item);
//                 }
//             });

//             draft.push(...insertCandidate);
//             // return [...insertCandidate, ...draft];
//         }),
//     )
//     .handleAction(
//         [rootActions.source.addOrUpdate],
//         produce((draft, action) => {
//             const data = action.payload;

//             const index = draft.findIndex((x) => x.id === data.id);

//             if (index >= 0) {
//                 draft.splice(index, 1, data);
//                 // return [data, ...draft.filter((x) => x.id !== data.id)];
//             } else {
//                 // return [data, ...draft];
//                 draft.push(data);
//             }
//         }),
//     )
//     .handleAction(
//         [rootActions.source.reomve],
//         produce((draft, action) => {
//             const data = action.payload;

//             const index = draft.findIndex((x) => x.id === data.id);
//             if (index >= 0) {
//                 draft.splice(index, 1);
//                 // return [...draft.filter((x) => x.id !== data.id)];
//             }

//             // return draft;
//         }),
//     );

// const form = createReducer<FormSource | null, RootAction>(null).handleAction(
//     [rootActions.source.setCurrentForm],
//     (state, action) => action.payload,
// );

const formPagedModel = createReducer<FormModelPagedModel | null, RootAction>(
    null,
)
    .handleAction(
        [rootActions.source.setFormsPagedModel],
        (state, action) => action.payload,
    )
    .handleAction([rootActions.source.removeFormModel], (state, action) => {
        const id = action.payload.id;

        var tempItems = state.items.slice();
        const foundIndex = tempItems.findIndex((x) => x.id === id);
        if (foundIndex >= 0) {
            tempItems.splice(foundIndex, 1);

            return {
                ...state,
                items: [...tempItems],
            };
        }

        return state;
    })
    .handleAction(
        [rootActions.source.addOrUpdateFormModel],
        (state, action) => {
            const id = action.payload.id;
            const tempItems = state.items.slice();
            const foundIndex = tempItems.findIndex((x) => x.id === id);
            if (foundIndex >= 0) {
                // update
                tempItems.splice(foundIndex, 1, action.payload);
            } else {
                // add
                tempItems.splice(0, 0, action.payload);
            }

            return {
                ...state,
                items: [...tempItems],
            };
        },
    );

const addedOrUpdatedFormId = createReducer<string | null, RootAction>(
    null,
).handleAction(
    [rootActions.source.setAddedOrUpdatedFormSourceId],
    (_, action) => action.payload,
);

const formModel = createReducer<FormModel | null, RootAction>(
    null,
).handleAction(
    [rootActions.source.setFormModel],
    (_, action) => action.payload,
);

export const formSourceState = combineReducers({
    // forms,
    formPagedModel,
    // form,
    formModel,
    addedOrUpdatedFormId,
});
export type FormSourceState = ReturnType<typeof formSourceState>;
