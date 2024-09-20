import axios from 'axios';


const instance = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
    timeout: 60 * 1000,

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

instance.interceptors.request.use((config) => {
    // const token = getToken();
    // if (false && token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});

export default instance;





