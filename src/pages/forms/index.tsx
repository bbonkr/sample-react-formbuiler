import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/common/Layout';
import Content from '../../components/Content';
import FormsList from '../../components/FormsList';

const HomePage = () => {
    const router = useRouter();

    return (
        <Layout>
            <Content title={'Forms List'} />
            <hr />
            <FormsList />
        </Layout>
    );
};

export default HomePage;
