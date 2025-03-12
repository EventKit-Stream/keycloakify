// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
const { heroui } = require("@heroui/react");


/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}", "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                geist: ["Geist", "sans-serif"]
            }
        }
    }, 
    darkMode: "class",
    plugins: [heroui()]
};
