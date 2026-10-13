export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://english-as-a-language.onrender.com/api'
    : 'http://localhost:3000/api');
