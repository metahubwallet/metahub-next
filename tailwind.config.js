/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // 全部颜色
            colors: {
                primary: '#bf01fa',
            },
        },
    },
    plugins: [],
}