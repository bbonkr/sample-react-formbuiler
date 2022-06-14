import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { LanguageModel, LanguagesApi } from '../../api';

interface LanguageQueryFilter {
    page?: number;
    limit?: number;
}

interface LanguageSelectorProps {
    id?: string;
    name?: string;
    value?: string;
    disabled?: boolean;
    onChange?: (language?: LanguageModel) => void;
}

const LanguageSelector = ({
    id,
    name,
    value,
    disabled,
    onChange,
}: LanguageSelectorProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_API ?? '';

    const [queryFilter, setQueryFilter] = useState<LanguageQueryFilter>();

    const {
        data: languages,
        isValidating: isLoadingLanguages,
        error: languagesError,
    } = useSWR(
        [`languages`, queryFilter?.page, queryFilter?.limit],
        (_, page, limit) => {
            if (typeof page === 'number' && typeof limit === 'number') {
                var client = new LanguagesApi(undefined, baseUrl);
                return client
                    .apiv10LanguagesGetLanguages({
                        page,
                        limit,
                        keyword: '',
                    })
                    .then((res) => res.data);
            }

            return undefined;
        },
        {
            refreshInterval: 0,
            revalidateIfStale: false,
            refreshWhenHidden: false,
            revalidateOnFocus: false,
            revalidateOnMount: false,
            revalidateOnReconnect: false,
            refreshWhenOffline: false,
        },
    );

    const handleChangeSelectedLanguage = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        if (onChange) {
            const selected = e.target.value;
            const selectedLanguage = languages.items?.find(
                (x) => x.id === selected,
            );

            onChange(selectedLanguage);
        }
    };

    useEffect(() => {
        setQueryFilter((_) => ({
            page: 1,
            limit: 10,
        }));
    }, []);

    return (
        <select
            id={id}
            name={name}
            value={value}
            disabled={disabled}
            onChange={handleChangeSelectedLanguage}
            title={isLoadingLanguages ? 'Loading languages' : 'Select language'}
        >
            {isLoadingLanguages && <option value="">{'Loading ... '}</option>}
            {languages?.items
                ?.sort((a, b) => (a.ordinal - b.ordinal > 0 ? 1 : -1))
                .map((l) => (
                    <option key={l.id} value={l.id}>
                        {l.name}
                    </option>
                ))}
        </select>
    );
};

export default LanguageSelector;
