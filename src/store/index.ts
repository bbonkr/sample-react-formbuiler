import { useMemo } from 'react';
import { createStore, Store } from 'redux';
import rootState, { RootState } from './reducers';

const initStore = (preloadedState?: RootState) => {
    const store = createStore(rootState, preloadedState);

    return store;
};

let __store: Store | undefined;

export const initialStore = (preloadedState?: RootState) => {
    let _store = __store ?? initStore(preloadedState);

    if (preloadedState && __store) {
        _store = initStore({
            ...__store.getState(),
            ...preloadedState,
        });

        __store = undefined;
    }

    if (typeof window === 'undefined') {
        return _store;
    }

    if (!__store) {
        __store = _store;
    }

    return _store;
};

export const useStore = (initialState?: RootState) => {
    const store = useMemo(() => initialStore(initialState), [initialState]);

    return store;
};
