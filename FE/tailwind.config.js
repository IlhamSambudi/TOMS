/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0F766E', // Teal 700
                    hover: '#115E59',   // Teal 800
                    light: '#F0FDFA',   // Teal 50
                },
                slate: {
                    900: '#0F172A',
                    800: '#1E293B',
                    700: '#334155',
                    600: '#475569',
                    500: '#64748B',
                    400: '#94A3B8',
                    300: '#CBD5E1',
                    200: '#E2E8F0',
                    100: '#F1F5F9',
                    50: '#F8FAF9', // Custom Surface
                }
            },
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
            },
            borderRadius: {
                'sm': '8px',
                'md': '10px',
                'lg': '12px',
                'xl': '16px',
                '2xl': '20px',
                '3xl': '24px',
                'full': '9999px',
            },
            spacing: {
                'sidebar': '248px',
                'sidebar-collapsed': '72px',
                'navbar': '64px',
            },
            maxWidth: {
                'content': '1400px',
            }
        },
    },
    plugins: [],
}
