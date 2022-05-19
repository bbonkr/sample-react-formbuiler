import React from 'react';
import Layout from '../../components/common/Layout';
import Content from '../../components/Content';
import FormsList from '../../components/FormsList';
import { useFormsApi } from '../../hooks/useFormsApi';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const FormListPage = () => {
    // const { forms } = useLocalStorage();
    const { forms } = useFormsApi();

    return (
        <Layout>
            <Content title={'Forms List'} />
            <hr />
            <FormsList records={forms} />
        </Layout>
    );
};

export default FormListPage;
