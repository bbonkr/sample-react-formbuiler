import React from 'react';
import Header from '../Header';

type MainProps = {};

const Layout = ({ children }: React.PropsWithChildren<MainProps>) => {
    return (
        <React.Fragment>
            <div>
                <Header />
                <main className="container mx-auto flex flex-col pt-3 justify-between">
                    {children}
                </main>
            </div>
        </React.Fragment>
    );
};

export default Layout;
