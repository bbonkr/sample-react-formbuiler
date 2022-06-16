import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useFormsApi } from '../../hooks/useFormsApi';
import { useResultsApi } from '../../hooks/useResultsApi';

const ResultList = () => {
    const [currentFormId, setCurrentFormId] = useState<string>();

    const { formPagedModel } = useFormsApi();

    const { results, getResults } = useResultsApi();

    const handleChangeFormSelect = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const formId = e.target.value;
        setCurrentFormId((_) => formId);
    };

    useEffect(() => {
        getResults(1, 10, currentFormId ? currentFormId : undefined);
    }, [currentFormId]);

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-full flex flex-row flex-1">
                <select
                    className="w-full flex-1"
                    onChange={handleChangeFormSelect}
                    value={currentFormId}
                >
                    <option value="">All forms</option>
                    {formPagedModel?.items?.map((item) => {
                        return (
                            <option key={item.id} value={item.id}>
                                {item.title}
                            </option>
                        );
                    })}
                </select>
            </div>
            <table className="table w-full">
                <thead>
                    <tr className="border-y-2">
                        <th className="py-2">Id</th>
                        <th className="py-2">Form</th>
                        <th className="py-2">Link</th>
                    </tr>
                </thead>
                <tbody>
                    {!results || results?.items.length === 0 ? (
                        <tr>
                            <td className="text-center" colSpan={3}>
                                No item
                            </td>
                        </tr>
                    ) : (
                        <React.Fragment>
                            {results.items.map((item) => {
                                return (
                                    <tr key={item.id} className="">
                                        <td className="text-center py-1">
                                            {item.id}
                                        </td>
                                        <td className="text-center py-1">
                                            <Link
                                                href={`/forms/${item.formId}`}
                                            >
                                                <a>{item.form?.title}</a>
                                            </Link>
                                        </td>
                                        <td className="text-center py-1">
                                            <Link href={`/results/${item.id}`}>
                                                <a>Result link {item.id}</a>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </React.Fragment>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ResultList;
