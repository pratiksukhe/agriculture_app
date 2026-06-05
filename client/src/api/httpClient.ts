import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants';

/**
 * Configured Axios instance with interceptors.
 *
 * Centralizes:
 * - Base URL configuration
 * - Request interceptors (auth tokens, headers)
 * - Response interceptors (error transformation)
 * - Consistent error handling across all API calls
 */
const httpClient: AxiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    timeout: 15_000,
    headers: {
        'Accept': 'application/json',
    },
});

/** Request interceptor — place to add auth tokens in the future. */
httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Future: Add auth token from context/storage
        // const token = getAuthToken();
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error: unknown) => Promise.reject(error),
);

/** Response interceptor — unwrap API envelope and normalize errors. */
httpClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Unwrap the API envelope: { success, data, message } → data
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
            response.data = response.data.data;
        }
        return response;
    },
    (error: unknown) => {
        if (axios.isAxiosError(error)) {
            // Extract the API error message if available
            const apiMessage = error.response?.data?.message;
            if (apiMessage && typeof apiMessage === 'string') {
                error.message = apiMessage;
            }
        }
        return Promise.reject(error);
    },
);

export default httpClient;
