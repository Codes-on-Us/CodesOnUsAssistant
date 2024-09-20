
import { toast } from "react-toastify"
import useHttpClient from "./Utilities/useHttpClient"
import { Http } from "./Utilities/Http"

export const UseHttpAssistant = () => {

    var { isLoading, send } = useHttpClient()


    const SendRequest: (method: Http, url: string, data?: any, responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream' | 'formdata', noErrorMessage?: boolean) => any
        = async (method: Http, url: string, data?: any, responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream' | 'formdata', noErrorMessage: boolean = false) => {

            var { errorMessage, response } = await send({
                method: method,
                url: url,
                data: data
            },
                responseType
            )
            if (errorMessage && !noErrorMessage) {
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


    const Get: (url: string, data?: any, noErrorMessage?: boolean) => any
        = async (url: string, data?: any, noErrorMessage?: boolean) => {
            return SendRequest(Http.GET, url, data, undefined, noErrorMessage)
        }

    const GetFile: (url: string, data?: any, noErrorMessage?: boolean) => any
        = async (url: string, data?: any, noErrorMessage?: boolean) => {
            return SendRequest(Http.GET, url, data, "blob", noErrorMessage)
        }

    const Post: (url: string, data?: any, noErrorMessage?: boolean) => any
        = async (url: string, data?: any, noErrorMessage?: boolean) => {
            return SendRequest(Http.POST, url, data, undefined, noErrorMessage)
        }

    const Put: (url: string, data?: any, noErrorMessage?: boolean) => any
        = async (url: string, data?: any, noErrorMessage?: boolean) => {
            return SendRequest(Http.PUT, url, data, undefined, noErrorMessage)
        }


    return {
        isLoading,
        Get,
        Post,
        Put,
        GetFile
    }
}

