import axios from 'axios';
import axiosRetry from 'axios-retry';

export const http = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000,
});

axiosRetry(http, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  shouldResetTimeout: true,
  retryCondition: (err) =>
    axiosRetry.isNetworkError(err) || (err.response?.status ?? 0) >= 500,
});
