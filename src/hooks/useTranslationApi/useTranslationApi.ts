import { useMemo, useState } from 'react';
import { TranslationsApi } from '../../api';

interface TranslateOptions {
    originLanguageCode: string;
    translateToLanguageCode: string;
    text: string;
    isHtml: boolean;
}

export const useTranslationApi = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API ?? '';
    const [translatedText, setTranslatedText] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const translationApiClient = useMemo(() => {
        const client = new TranslationsApi(undefined, baseUrl);
        return client;
    }, []);

    const translate = (options: TranslateOptions) => {
        setIsLoading((_) => true);
        setTranslatedText((_) => undefined);
        translationApiClient
            .apiv10TranslationsTranslate({
                getTranslatedTextQuery: {
                    originLanguageCode: options.originLanguageCode,
                    translateToLanguageCode: options.translateToLanguageCode,
                    text: options.text,
                    isHtml: options.isHtml,
                },
            })
            .then((response) => {
                setTranslatedText((_) => response.data.text);
            })
            .finally(() => {
                setIsLoading((_) => false);
            });
    };

    return {
        translatedText,
        isLoading,
        translate,
    };
};
