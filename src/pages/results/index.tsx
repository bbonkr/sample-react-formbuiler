import React from 'react';
import Layout from '../../components/common/Layout';
import Content from '../../components/Content';
import ResultList from '../../components/ResultList/ResultList';
import Head from 'next/head';

const ResultListPage = () => {
    return (
        <Layout>
            <Head>
                <title>Result List</title>
            </Head>
            <Content title={'Result List'} />
            <hr />
            <ResultList />
        </Layout>
    );
};

export default ResultListPage;
