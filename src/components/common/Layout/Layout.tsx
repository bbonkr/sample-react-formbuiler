import React from 'react';
import Header from '../Header';

interface MainProps {
    noHeader?: boolean;
}

const Layout = ({ noHeader, children }: React.PropsWithChildren<MainProps>) => {
    return (
        <React.Fragment>
            <div>
                {!noHeader && <Header />}
                <main className="container mx-auto flex flex-col pt-3 justify-between">
                    {children}
                </main>
            </div>
        </React.Fragment>
    );
};

export default Layout;
