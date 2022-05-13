import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/common/Layout';
import Content from '../../../components/Content';
import FormViewer from '../../../components/FormViewer';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { FormSource } from '../../../components/FormRenderer/types';

const HomePage = () => {
    const { forms } = useLocalStorage();
    const router = useRouter();

    const [formSource, setFormSource] = useState<FormSource>();

    const handleClickNavigate = useCallback(() => {
        router.push('/about');
    }, []);

    useEffect(() => {
        if (forms) {
            const { id } = router.query;
            if (typeof id === 'string') {
                // console.info('id', id);
                const currentFormSource = forms.find((x) => x.id === id);
                setFormSource((_) => currentFormSource);
            }
        }
    }, [forms, router.query]);

    return (
        <Layout>
            <Content title={'Forms'} />
            <hr />
            {formSource && <FormViewer record={formSource} />}
        </Layout>
    );
};

export default HomePage;
