import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/common/Layout';
import Content from '../../../components/Content';
import FormViewer from '../../../components/FormViewer';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { FormSource } from '../../../components/FormRenderer/types';
import { useFormsApi } from '../../../hooks/useFormsApi';

const FormItemPage = () => {
    // const { forms } = useLocalStorage();
    const { form, getForm } = useFormsApi();
    const router = useRouter();

    // const [formSource, setFormSource] = useState<FormSource>();

    const handleClickNavigate = useCallback(() => {
        router.push('/about');
    }, []);

    useEffect(() => {
        const { id } = router.query;
        if (typeof id === 'string') {
            // const currentFormSource = forms.find((x) => x.id === id);
            // setFormSource((_) => currentFormSource);
            getForm(id);
        }
    }, [router.query]);

    return (
        <Layout>
            <Content title={'Forms'} />
            <hr />
            {form && <FormViewer record={form} />}
        </Layout>
    );
};

export default FormItemPage;
