
import { toast } from "react-toastify"
import { Http } from "./Utilities/Http"
import { useHttpClient } from "./Utilities/useHttpClient"


export const UseHttpAssistant = () => {

    var { isLoading, send } = useHttpClient()

    const SendRequest: (method: Http, url: string, data?: any, responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream' | 'formdata', noErrorMessage?: boolean, baseURL?: string | undefined) => any
        = async (method: Http, url: string, data?: any, responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream' | 'formdata', noErrorMessage: boolean = false, baseURL?: string | undefined) => {

            var { errorMessage, response, dontShowMessage } = await send({
                baseURL: baseURL,
                method: method,
                url: url,
                data: data,
                timeout: 5 * 60 * 1000
            },
                responseType
            )

            if (errorMessage && !noErrorMessage && !dontShowMessage) {
                toast.error(errorMessage, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });

                return undefined
            }

            return response

        }


    const Get: (url: string, data?: any, noErrorMessage?: boolean, baseURL?: string | undefined) => any
        = async (url: string, data?: any, noErrorMessage?: boolean, baseURL?: string | undefined) => {
            return SendRequest(Http.GET, url, data, undefined, noErrorMessage, baseURL)
        }

    const GetFile: (url: string, data?: any, noErrorMessage?: boolean, baseURL?: string | undefined) => any
        = async (url: string, data?: any, noErrorMessage?: boolean, baseURL?: string | undefined) => {
            return SendRequest(Http.GET, url, data, "blob", noErrorMessage, baseURL)
        }

    const PostFile: (url: string, data?: any, noErrorMessage?: boolean, baseURL?: string | undefined) => any
        = async (url: string, data?: any, noErrorMessage?: boolean, baseURL?: string | undefined) => {
            return SendRequest(Http.POST, url, data, "blob", noErrorMessage, baseURL)
        }

    const Post: (url: string, data?: any, noErrorMessage?: boolean, baseURL?: string | undefined) => any
        = async (url: string, data?: any, noErrorMessage?: boolean, baseURL?: string | undefined) => {
            return SendRequest(Http.POST, url, data, undefined, noErrorMessage, baseURL)
        }

    const Put: (url: string, data?: any, noErrorMessage?: boolean, baseURL?: string | undefined) => any
        = async (url: string, data?: any, noErrorMessage?: boolean, baseURL?: string | undefined) => {
            return SendRequest(Http.PUT, url, data, undefined, noErrorMessage, baseURL)
        }


    return {
        isLoading,
        Get,
        Post,
        Put,
        GetFile
    }
}

