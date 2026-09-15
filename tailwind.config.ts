import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aws: {
          squid: "#232F3E",
          deep: "#0F172A",
          dark: "#131921",
          amber: "#FF9900",
          amberHover: "#EC8B00",
          blue: "#0073BB",
          lightBlue: "#00A4E4",
          card: "#1E293B",
          cardBorder: "#334155",
          accent: "#38BDF8",
          emerald: "#10B981",
          rose: "#F43F5E"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'timer-alert': 'timerAlert 1s ease-in-out infinite alternate',
      },
      keyframes: {
        timerAlert: {
          '0%': { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.4)' },
          '100%': { backgroundColor: 'rgba(239, 68, 68, 0.25)', borderColor: 'rgba(239, 68, 68, 0.9)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
