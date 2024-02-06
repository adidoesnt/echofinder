import axios, { type AxiosInstance } from 'axios';
import { type Logger as Log4js } from 'log4js';
import { Logger } from 'components/logger';

const {
    BACKEND_HOST: host = '127.0.0.1',
    BACKEND_PORT: port = 8080,
    API_CLIENT_TIMEOUT: timeout = 10000,
    BACKEND_API_KEY: apiKey = 'DUMMY-KEY',
} = process.env;

export class ApiClient {
    private static instance: ApiClient;
    private readonly client: AxiosInstance;
    private logger: Log4js;

    static getBaseUrl() {
        return `http://${host}:${port}`;
    }

    private constructor() {
        const baseURL = ApiClient.getBaseUrl();
        this.logger = Logger.getLogger('ApiClient');
        this.client = axios.create({
            baseURL,
            timeout: Number(timeout),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.client.interceptors.request.use(
            (config) => {
                config.headers['x-api-key'] = apiKey;
                return config;
            },
            (error) => {
                this.logger.error('Request error', error);
                return Promise.reject(error);
            },
        );
    }

    static getInstance() {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    async get(path: string, params = {}) {
        const response = await this.client.get(path, { params });
        const { data } = response;
        return data;
    }

    async post(path: string, data = {}, params = {}) {
        const response = await this.client.post(path, data, { params });
        const { data: responseData } = response;
        return responseData;
    }

    async put(path: string, data = {}, params = {}) {
        const response = await this.client.put(path, data, { params });
        const { data: responseData } = response;
        return responseData;
    }

    async delete(path: string, params = {}) {
        const response = await this.client.delete(path, { params });
        const { data } = response;
        return data;
    }
}
