import axios from 'axios';

export const AxiosFileinstance = () => {

    const axiosFileinstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        withCredentials: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'multipart/form-data',
        },
        timeout: 30000000,
        transformRequest: [(data) => {
            if (data instanceof FormData) {
                return data;
            }
            return JSON.stringify(data);
        }],
        transformResponse: [(data) => {
            if (typeof data === 'string') {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    return data;
                }
            }
            return data;
        }],
    });

    axiosFileinstance.interceptors.request.use((config) => {

        // const token = getToken();
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }

        return config;
    });

    return axiosFileinstance
}
