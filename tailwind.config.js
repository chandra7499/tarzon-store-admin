/** @type {import('tailwindcss').Config} */
export const darkMode = ["class"];
export const content = [
  "./src/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      sidebar: "hsl(var(--sidebar))",
      "sidebar-foreground": "hsl(var(--sidebar-foreground))",
      "sidebar-primary": "hsl(var(--sidebar-primary))",
      "sidebar-primary-foreground": "hsl(var(--sidebar-primary-foreground))",
      "sidebar-accent": "hsl(var(--sidebar-accent))",
      "sidebar-accent-foreground": "hsl(var(--sidebar-accent-foreground))",
      "sidebar-border": "hsl(var(--sidebar-border))",
      "sidebar-ring": "hsl(var(--sidebar-ring))",
    },
  },
};
export const plugins = [];
