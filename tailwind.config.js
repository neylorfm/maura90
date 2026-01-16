/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}" // Catch App.tsx in root
    ],
    theme: {
        extend: {
            colors: {
                primary: "#eeb72b", // Gold
                "background-light": "#f8f7f6", // Cream
                "background-dark": "#221d10", // Deep Brown/Black
                "primary-dark": "#181611",
                "accent-gold": "#897e61",
            },
            fontFamily: {
                display: ["Public Sans", "sans-serif"],
                serif: ["Newsreader", "serif"],
                sans: ["Noto Sans", "sans-serif"],
            },
            animation: {
                "fade-in": "fadeIn 1s ease-in-out",
                "slide-up": "slideUp 0.8s ease-out forwards",
                "ken-burns": "kenBurns 20s infinite alternate",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                kenBurns: {
                    "0%": { transform: "scale(1)" },
                    "100%": { transform: "scale(1.1)" },
                },
            },
        },
    },
    plugins: [],
}
