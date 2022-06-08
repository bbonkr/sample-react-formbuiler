import React from 'react';
import Layout from '../../components/common/Layout';
import Content from '../../components/Content';
import ResultList from '../../components/ResultList/ResultList';
import { useResultsApi } from '../../hooks/useResultsApi';
import Head from 'next/head';

const ResultListPage = () => {
    // const { results } = useLocalStorage();
    const { results } = useResultsApi();

    return (
        <Layout>
            <Head>
                <title>Result List</title>
            </Head>
            <Content title={'Result List'} />
            <hr />
            <ResultList records={results} />
        </Layout>
    );
};

export default ResultListPage;
