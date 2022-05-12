import React from 'react';

type ContentProps = {
    title: string;
};

const Content = ({ title }: ContentProps) => {
    return (
        <div className="py-6 flex flex-col justify-center items-center">
            <h1 className="text-3xl">{title}</h1>
        </div>
    );
};

export default Content;
