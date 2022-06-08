import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/common/Layout';
import Content from '../components/Content';
import FormBuilder from '../components/FormBuilder';
import Head from 'next/head';

const HomePage = () => {
    const router = useRouter();

    const handleClickNavigate = useCallback(() => {
        router.push('/about');
    }, []);

    return (
        <Layout>
            <Head>
                <title>Form Builder</title>
            </Head>
            <Content title={'Form Builder'} />
            <hr />
            <FormBuilder />
        </Layout>
    );
};

export default HomePage;
