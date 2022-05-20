import React, { useMemo } from 'react';
import { FilesApi } from '../../api';
import FileDownloadHelper from '@bbon/filedownload';
import Axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

interface DownloadLinkRendererProps {
    value?: string;
}

export const DownloadLinkRenderer = ({ value }: DownloadLinkRendererProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_API;

    const isUri = (sample: string) => {
        const urlPattern =
            /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/gim;

        return urlPattern.test(sample);
    };

    const fileName = useMemo(() => {
        if (isUri(value)) {
            const tokens = value.split('/');
            console.info('tokens:', tokens);
            if (tokens.length > 1) {
                return tokens[tokens.length - 1];
            } else {
                return value;
            }
        }
    }, [value]);

    const handleClickUri = () => {
        const requestConfig: AxiosRequestConfig = {
            responseType: 'blob',
        };
        const axiosInstance = Axios.create(requestConfig);
        var client = new FilesApi(undefined, baseUrl, axiosInstance);
        client
            .apiv10FilesDownload({ getFileByUriQuery: { uri: value } })
            .then((response) => {
                const contentType =
                    response.headers['content-type'] ||
                    'application/octet-stream';
                const helper = new FileDownloadHelper();

                helper.download({
                    data: response.data,
                    filename: fileName,
                    contentType,
                });
            });
    };

    if (isUri(value)) {
        return <button onClick={handleClickUri}>{fileName}</button>;
    }

    return <span>{value}</span>;
};
