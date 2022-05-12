import React from 'react';
import RouterIndicator from '../components/common/RouteIndicator';

import '../styles/globals.css';

const SampleApp = ({ Component, pageProps }) => {
    return (
        <React.Fragment>
            <Component {...pageProps} />
            <RouterIndicator />
        </React.Fragment>
    );
};

export default SampleApp;
