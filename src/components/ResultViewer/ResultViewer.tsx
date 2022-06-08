import React, { useMemo } from 'react';
import { ResultModel } from '../../api';
import { FormResult } from '../FormRenderer';
import { DownloadLinkRenderer } from './DownloadLinkRenderer';

interface ResultViewerProps {
    record: ResultModel;
}

const ResultViewer = ({ record }: ResultViewerProps) => {
    const formResult = useMemo(() => {
        if (!record.content) {
            return undefined;
        }

        const result = JSON.parse(record.content) as FormResult;

        return result;
    }, [record]);

    return (
        <div>
            <h1>{record.id}</h1>
            <hr className="py-3" />
            <div>
                <dl>
                    <dt>Form:</dt>
                    <dd>{record.form?.title}</dd>
                </dl>
            </div>
            <hr className="py-3" />
            <div>
                <dl className="my-3">
                    {formResult?.items?.map((item) => {
                        return (
                            <React.Fragment key={item.id}>
                                <dt className="">{item.label}</dt>
                                <dd className="font-bold">
                                    {Array.isArray(item.answers) ? (
                                        <ul>
                                            {item.answers.map((a) => (
                                                <li key={a}>
                                                    <DownloadLinkRenderer
                                                        value={a}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <DownloadLinkRenderer
                                            value={item.answers}
                                        />
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
