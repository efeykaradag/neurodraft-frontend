/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {},
    },
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [ require('@tailwindcss/typography'),],
}

