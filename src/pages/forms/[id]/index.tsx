import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/common/Layout';
import Content from '../../../components/Content';
import FormViewer from '../../../components/FormViewer';
import { useFormsApi } from '../../../hooks/useFormsApi';

const FormItemPage = () => {
    const { formModel, getForm } = useFormsApi();
    const router = useRouter();

    useEffect(() => {
        const { id } = router.query;
        if (typeof id === 'string') {
            getForm(id);
        }
    }, [router.query]);

    return (
        <Layout>
            <Content title={'Forms'} />
            <hr />
            {formModel && <FormViewer record={formModel} />}
        </Layout>
    );
};

export default FormItemPage;
