import React from 'react';
import { FormResult } from '../FormRenderer';

interface ResultViewerProps {
    record: FormResult;
}

const ResultViewer = ({ record }: ResultViewerProps) => {
    return (
        <div>
            <h1>{record.id}</h1>
            <div>
                <dl className="my-3">
                    {record.items?.map((item) => {
                        return (
                            <React.Fragment key={item.id}>
                                <dt className="">{item.label}</dt>
                                <dd className="font-bold">
                                    {Array.isArray(item.answers) ? (
                                        <ul>
                                            {item.answers.map((a) => (
                                                <li key={a}>{a}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        item.answers
                                    )}
                                </dd>
                            </React.Fragment>
                        );
                    })}
                </dl>
            </div>
        </div>
    );
};

export default ResultViewer;
