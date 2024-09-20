import { useContext, useState } from 'react';
import AxiosInstance from "./axiosInstance"
import axios, { AxiosRequestConfig } from 'axios';
import { UserContext } from '../../AssistantProvider';


interface Response<T> {
    response: T | null;
    errorMessage: string | null;
    statusCode: string
}

export interface UseHttpClientResponse<T> {
    isLoading: boolean;
    send: (requests: RequestObject, responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream' | 'formdata') => Promise<Response<T>>;
}

type RequestObject = AxiosRequestConfig & { url: string; method?: AxiosRequestConfig['method']; data?: any };

export function useHttpClient<T>(): UseHttpClientResponse<T> {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const userState = useContext(UserContext);

    const logout = () => {
        userState?.[1](undefined)
    }


    const send = async (
        request: RequestObject,
        responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream' | 'formdata'
    ) => {
        setIsLoading(true);
        try {

            if (responseType) {
                request.responseType = responseType
            }

            if (request.method?.toLowerCase() === 'get' && request.data) {
                // Convert data to query params
                request.params = request.data;
                // Remove the data property
                delete request.data;
            }

            var res = await AxiosInstance.request<T>(request);
            setIsLoading(false);

            return { response: res.data, errorMessage: null, statusCode: '200' };
        } catch (error: any) {

            setIsLoading(false);
            let errorMessage: string = '';
            var responetError = error?.response?.data

            if (error.response?.status === 401) {

                errorMessage = responetError?.message ?? "You are unauthorized to access this resource."
                logout()


            } else if (responetError?.failed === true && responetError?.validationErrors && Object.keys(responetError?.validationErrors).length > 0) {

                Object.keys(responetError?.validationErrors).map((key) => {
                    var item = responetError?.validationErrors[key] as string[]
                    errorMessage += item.join("<br/>")
                })

            } else if (responetError?.failed === true && responetError?.message && typeof (responetError.message) === 'string') {
                errorMessage = responetError.message

            } else if (error?.code === "ERR_NETWORK") {
                errorMessage = "Please check your internet Connection and try again";

            } else if (error?.code === "ECONNABORTED") {
                errorMessage = "Time out error, Please try again";

            } else if (error?.response?.data?.result?.exceptionMessage?.error?.message && typeof (error?.response?.data?.result?.exceptionMessage?.error?.message) === 'string') {
                errorMessage = error?.response?.data?.result?.exceptionMessage?.error?.message;

                if (error?.response?.data?.result?.exceptionMessage?.error?.validationErrors && (error?.response?.data?.result?.exceptionMessage?.error?.validationErrors as any[]).length > 0) {

                    (error?.response?.data?.result?.exceptionMessage?.error?.validationErrors as any[]).forEach(validationError => {
                        if (validationError && validationError?.message && typeof (validationError?.message) === 'string') {
                            errorMessage += "\n" + validationError?.message
                        }
                    })
                }

            } else if (axios.isAxiosError(error) && error.response?.status === 401) {

                errorMessage = 'UnAuthorized';
                logout()

            }
            else if (error instanceof Error && error.message === 'Network Error') {
                errorMessage = 'A network error occurred. Please try again later.';
            }
            else {
                errorMessage = 'An unknown error occurred';
            }

            return { response: null, errorMessage, statusCode: error.response?.status };
        }
    }

    return {
        isLoading,
        send,
    };
}