import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/common/Layout';
import Content from '../../../components/Content';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { FormResult } from '../../../components/FormRenderer/types';
import ResultViewer from '../../../components/ResultViewer/ResultViewer';

const ResultItemPage = () => {
    const { results } = useLocalStorage();
    const router = useRouter();

    const [result, setResult] = useState<FormResult>();

    const handleClickNavigate = useCallback(() => {
        router.push('/about');
    }, []);

    useEffect(() => {
        if (results) {
            const { id } = router.query;
            if (typeof id === 'string') {
                const current = results.find((x) => x.id === id);
                setResult((_) => current);
            }
        }
    }, [results, router.query]);

    return (
        <Layout>
            <Content title={'Result'} />
            <hr />
            {result && <ResultViewer record={result} />}
        </Layout>
    );
};

export default ResultItemPage;
