import Link from 'next/link';
import React from 'react';
import { FormResult } from '../FormRenderer';

interface ResultListProps {
    records?: FormResult[];
}

const ResultList = ({ records }: ResultListProps) => {
    return (
        <div>
            <table className="table w-full">
                <thead>
                    <tr className="border-y-2">
                        <th className="py-2">Id</th>
                        <th className="py-2">Form</th>
                        <th className="py-2">Link</th>
                    </tr>
                </thead>
                <tbody>
                    {!records || records?.length === 0 ? (
                        <tr>
                            <td className="text-center" colSpan={3}>
                                No item
                            </td>
                        </tr>
                    ) : (
                        <React.Fragment>
                            {records.map((item) => {
                                return (
                                    <tr key={item.id} className="">
                                        <td className="text-center py-1">
                                            {item.id}
                                        </td>
                                        <td>
                                            <Link
                                                href={`/forms/${item.formId}`}
                                            >
                                                <a>{item.formId}</a>
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
