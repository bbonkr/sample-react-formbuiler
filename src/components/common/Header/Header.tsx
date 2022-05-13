import React from 'react';
import Link from 'next/link';

import { FaGithub } from 'react-icons/fa';

const Header = () => {
    return (
        <header className="bg-gray-800 ">
            <nav className="container mx-auto flex justify-between px-6 py-3">
                <div className="flex justify-start items-center">
                    <p className="text-lg text-gray-300 shadow-sm">
                        <Link href="/">
                            <a>Form Builder</a>
                        </Link>
                    </p>
                </div>

                <div className="flex items-center justify-start gap-6">
                    <div className="flex items-center justify-start gap-3">
                        <Link href="/">
                            <a className="text-slate-200">Form Builder</a>
                        </Link>
                        <Link href="/forms">
                            <a className="text-slate-200">Forms</a>
                        </Link>
                    </div>
                    <div className="flex justify-start items-center">
                        <a
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center"
                            href="https://github.com/bbonkr/sample-react-formbuiler"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <FaGithub />
                        </a>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
