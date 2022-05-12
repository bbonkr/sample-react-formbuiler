import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/common/Layout';
import Content from '../components/Content';

const AboutPage = () => {
    const router = useRouter();

    const handleClickNavigate = useCallback(() => {
        router.push('/');
    }, []);

    return (
        <Layout>
            <Content title="About" />
            <hr />
        </Layout>
    );
};

export default AboutPage;
