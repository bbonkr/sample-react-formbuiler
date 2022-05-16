import React, { useRef } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { FormSource } from '../FormRenderer';

const ImportData = () => {
    const { bulkImport } = useLocalStorage();
    const inputFileRef = useRef<HTMLInputElement>();

    const handleReaderLoad = (e: ProgressEvent<FileReader>) => {
        const jsonString: string = e.target.result as string;
        const sources = JSON.parse(jsonString) as FormSource[];

        if (sources) {
            bulkImport(sources);
            console.info('done');
        }

        if (inputFileRef.current) {
            inputFileRef.current.value = '';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.addEventListener('load', handleReaderLoad);

            reader.readAsText(file);
        }
    };

    return (
        <label className="block shadow">
            <span className="sr-only">Import</span>
            <input
                ref={inputFileRef}
                type="file"
                className="block w-full file:py-2 file:px-6 file:rounded file:border-1 file:border-gray-400"
                multiple={false}
                accept="application/json"
                onChange={handleChange}
            />
        </label>
    );
};

export default ImportData;
