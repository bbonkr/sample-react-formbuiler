import Link from 'next/link';
import React from 'react';
import { FormModelPagedModel } from '../../api';

interface FormsListProps {
    records: FormModelPagedModel | null;
}

const FormsList = ({ records }: FormsListProps) => {
    return (
        <div>
            <table className="table w-full">
                <thead>
                    <tr className="border-y-2">
                        <th className="py-2">Id</th>
                        <th className="py-2">Link</th>
                    </tr>
                </thead>
                <tbody>
                    {(records?.items?.length ?? 0) === 0 ? (
                        <tr>
                            <td className="text-center" colSpan={2}>
                                No item
                            </td>
                        </tr>
                    ) : (
                        <React.Fragment>
                            {records.items.map((item) => {
                                return (
                                    <tr key={item.id} className="">
                                        <td className="text-center py-1">
                                            {item.id}
                                        </td>
                                        <td className="text-center py-1">
                                            <Link href={`/forms/${item.id}`}>
                                                <a>Form link {item.id}</a>
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

export default FormsList;
