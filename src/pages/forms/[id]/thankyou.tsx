import Head from 'next/head';
import React from 'react';
import Layout from '../../../components/common/Layout';

const ThankyouPage = () => {
    const handleClickClose = () => {
        window.close();
    };

    return (
        <Layout noHeader>
            <Head>
                <title>Thank you for responding</title>
            </Head>
            <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center">
                <div className="flex flex-col justify-center items-center border-2 rounded px-10 py-6 bg-slate-100 dark:bg-slate-700">
                    <h2 className="text-lg font-extrabold">
                        Thank you for responding. :)
                    </h2>

                    <hr className="my-6" />

                    <button
                        type="button"
                        className="button flex"
                        onClick={handleClickClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default ThankyouPage;
