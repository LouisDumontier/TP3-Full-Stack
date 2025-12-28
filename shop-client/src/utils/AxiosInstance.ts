import axios, { AxiosError, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API,
    timeout: 10000,
});

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const customError = {
            message: 'An error occurred',
            status: error.response?.status,
            originalError: error,
        };

        if (error.code === 'ECONNABORTED') {
            customError.message = 'Request timeout - server is not responding';
        } else if (error.code === 'ERR_NETWORK' || !error.response) {
            customError.message = 'Unable to connect to the server';
        } else {
            switch (error.response?.status) {
                case 400:
                    customError.message = 'Invalid request';
                    break;
                case 404:
                    customError.message = 'Resource not found';
                    break;
                case 500:
                    customError.message = 'Server error';
                    break;
                default:
                    customError.message = `Error: ${error.response?.statusText || 'Unknown error'}`;
            }
        }

        return Promise.reject(customError);
    },
);

export default axiosInstance;
