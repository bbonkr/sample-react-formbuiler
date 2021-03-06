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
                        <th className="py-2">Title</th>
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
                                        <td className="py-1">{item.title}</td>
                                        <td className="py-1">
                                            <a
                                                href={`/forms/${item.id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Form link {item.title}
                                            </a>
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
