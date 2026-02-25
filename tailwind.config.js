// tailwind.config.js
export default {
  darkMode: 'class', // Enable dark mode using the class strategy
  content: [
    "./app/components/**/*.{vue,js,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/app.vue",
  ],
  theme: {
    extend: {
    },
  },
  plugins: [],
}