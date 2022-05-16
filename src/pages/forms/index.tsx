import React from 'react';
import Layout from '../../components/common/Layout';
import Content from '../../components/Content';
import FormsList from '../../components/FormsList';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const FormListPage = () => {
    const { forms } = useLocalStorage();

    return (
        <Layout>
            <Content title={'Forms List'} />
            <hr />
            <FormsList records={forms} />
        </Layout>
    );
};

export default FormListPage;
