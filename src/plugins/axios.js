import axios from 'axios';
const BASE_URL = import.meta.env.VITE_APP_API_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 300000,

    // Aquí puedes añadir más configuraciones como headers por defecto
});

export default axiosInstance;