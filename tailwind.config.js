/** @type {import('tailwindcss').Config} */

const getUnits = () => {
    let units = {};
    for (let i = 1; i < 600; i++) {
        units[i] = i + 'px';
    }
    return units;
}
const units = getUnits();

export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#bf01fa',
            },
            // width: units,
            // height: units,
            // padding: units,
            // margin: units,
            // inset: units,
            // borderRadius: units,
            // gap: units,
        },
    },
    plugins: [],
}