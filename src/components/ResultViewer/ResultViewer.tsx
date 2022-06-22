import React from 'react';
import { ResultModel } from '../../api';
import { DownloadLinkRenderer } from './DownloadLinkRenderer';

interface ResultViewerProps {
    record: ResultModel;
}

const ResultViewer = ({ record }: ResultViewerProps) => {
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
                    {record?.items?.map((item) => {
                        return (
                            <React.Fragment key={item.id}>
                                <dt className="">{item.formItem?.label}</dt>
                                <dd className="font-bold">
                                    <ul>
                                        {item.values.map((a) => (
                                            <li key={a.id}>
                                                <DownloadLinkRenderer
                                                    value={a.value}
                                                />
                                            </li>
                                        ))}
                                    </ul>
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
