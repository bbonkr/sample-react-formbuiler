import React, { Children, useEffect } from 'react';

interface ModalProps {
    isOpen?: boolean;
    title?: React.ReactNode;
    onClose?: () => void;
}

const Modal = ({
    isOpen,
    title,
    children,
    onClose,
}: React.PropsWithChildren<ModalProps>) => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (onClose) {
                onClose();
            }
        }
    };
    useEffect(() => {
        if (isOpen) {
            window.document.body.classList.add('overflow-hidden');

            window.document.addEventListener('keyup', handleKeyboardEvent);
        } else {
            window.document.body.classList.remove('overflow-hidden');
        }

        return () => {
            window.document.body.classList.remove('overflow-hidden');
            window.document.removeEventListener('keyup', handleKeyboardEvent);
        };
    }, [isOpen]);

    if (!isOpen) {
        return <React.Fragment></React.Fragment>;
    }

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-20 px-10 py-10">
            <div
                className="absolute top-0 bottom-0 left-0 right-0 bg-slate-800 opacity-80"
                onClick={onClose}
            ></div>
            <div className="relative  flex-col justify-center items-center">
                <div className="bg-slate-50 w-full">
                    <div className="relative flex flex-col justify-start items-center bg-slate-700 text-slate-100 dark:bg-slate-600 dark:text-slate-200">
                        {title && <div>{title}</div>}
                        <div className="absolute top-0 right-0">
                            <button
                                type="button"
                                className="button flex"
                                onClick={onClose}
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                    <div className="p-10 max-h-80p overflow-y-scroll">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
