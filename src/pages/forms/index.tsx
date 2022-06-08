import React from 'react';
import Layout from '../../components/common/Layout';
import Content from '../../components/Content';
import FormsList from '../../components/FormsList';
import { useFormsApi } from '../../hooks/useFormsApi';
import Head from 'next/head';

const FormListPage = () => {
    const { formPagedModel } = useFormsApi();

    return (
        <Layout>
            <Head>
                <title>Form List</title>
            </Head>
            <Content title={'Forms List'} />
            <hr />
            <FormsList records={formPagedModel} />
        </Layout>
    );
};

export default FormListPage;
