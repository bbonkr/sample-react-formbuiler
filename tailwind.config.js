const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');

module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {
            opacity: ['disabled'],
        },
    },
    plugins: [typography, forms],
};
