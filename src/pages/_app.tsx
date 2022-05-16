import React from 'react';
import RouterIndicator from '../components/common/RouteIndicator';
import { Provider } from 'react-redux';
import { useStore } from '../store';

import '../styles/globals.css';

const SampleApp = ({ Component, pageProps }) => {
    // const currentStore = useMemo(() => store, []);
    const store = useStore();

    return (
        <React.Fragment>
            <Provider store={store}>
                <Component {...pageProps} />
                <RouterIndicator />
            </Provider>
        </React.Fragment>
    );
};

export default SampleApp;
