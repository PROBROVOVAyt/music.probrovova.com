/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Автоматически использовать тему системы
  content: ["./**/*.html", "./static/js/**/*.js"], // Укажите путь к вашим файлам
  theme: {
    extend: {
      screens: {
        sm: "640px", // Мобильные устройства
        md: "768px", // Планшеты
        lg: "1024px", // Лэптопы и небольшие десктопы
        xl: "1280px", // Большие экраны и десктопы
        "2xl": "1536px" // Очень большие экраны
      }
    }
  },
  plugins: []
};
