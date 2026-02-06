import { toast } from "react-toastify";
import { Http } from "./Utilities/Http";
import { useHttpClient } from "./Utilities/useHttpClient";
import axios, { AxiosResponse } from "axios";
import { useContext } from "react";
import { HttpCacheContext } from "../AssistantProvider";

export const UseHttpAssistant = () => {
  var { isLoading, send } = useHttpClient<any>();
  const cacheContext = useContext(HttpCacheContext);
  const [cache, setCache] = cacheContext || [new Map(), () => {}];

  const generateCacheKey = (method: Http, url: string, data?: any, baseURL?: string) => {
    return `${method}:${baseURL || ""}:${url}:${JSON.stringify(data || {})}`;
  };

  const SendRequest: (
    method: Http,
    url: string,
    data?: any,
    responseType?:
      | "arraybuffer"
      | "blob"
      | "document"
      | "json"
      | "text"
      | "stream"
      | "formdata",
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    isPublicFiles?: boolean,
    useCache?: boolean,
  ) => any = async (
    method: Http,
    url: string,
    data?: any,
    responseType?:
      | "arraybuffer"
      | "blob"
      | "document"
      | "json"
      | "text"
      | "stream"
      | "formdata",
    noErrorMessage: boolean = false,
    baseURL?: string | undefined,
    isPublicFiles?: boolean,
    useCache: boolean = false,
  ) => {
    if (isPublicFiles) {
      try {
        const response: AxiosResponse<Blob> = await axios.get(url, {
          responseType: "blob",
          headers: {
            Accept: "application/octet-stream",
          },
        });
        return response.data;
      } catch (error) {
        console.error("Download failed:", error);
        throw error;
      }
    } else {
      const cacheKey = generateCacheKey(method, url, data, baseURL);

      if (useCache && cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }

      var { errorMessage, response, dontShowMessage } = await send(
        {
          baseURL: baseURL,
          method: method,
          url: url,
          data: data,
          timeout: 5 * 60 * 1000,
        },
        responseType,
      );

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

        return undefined;
      }

      if (useCache && response) {
        const newCache = new Map(cache);
        newCache.set(cacheKey, response);
        setCache(newCache);
      }

      return response;
    }
  };

  const SendRequestWithError = async (
    method: Http,
    url: string,
    data?: any,
    responseType?:
      | "arraybuffer"
      | "blob"
      | "document"
      | "json"
      | "text"
      | "stream"
      | "formdata",
    noErrorMessage: boolean = false,
    baseURL?: string | undefined,
    useCache: boolean = false,
  ) => {
    const cacheKey = generateCacheKey(method, url, data, baseURL);

    if (useCache && cache.has(cacheKey)) {
      return { response: cache.get(cacheKey), error: null };
    }

    var { errorMessage, response, dontShowMessage, error } = await send(
      {
        baseURL: baseURL,
        method: method,
        url: url,
        data: data,
        timeout: 5 * 60 * 1000,
      },
      responseType,
    );

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

      return { response, error };
    }

    if (useCache && response) {
      const newCache = new Map(cache);
      newCache.set(cacheKey, response);
      setCache(newCache);
    }

    return { response, error };
  };

  const Get: (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    useCache?: boolean,
  ) => any = async (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    useCache: boolean = false,
  ) => {
    return SendRequest(Http.GET, url, data, undefined, noErrorMessage, baseURL, false, useCache);
  };

  const GetWithErrorResponse = async (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    useCache: boolean = false,
  ) => {
    return SendRequestWithError(
      Http.GET,
      url,
      data,
      undefined,
      noErrorMessage,
      baseURL,
      useCache,
    );
  };

  const Delete: (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    useCache?: boolean,
  ) => any = async (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    useCache: boolean = false,
  ) => {
    return SendRequest(
      Http.DELETE,
      url,
      data,
      undefined,
      noErrorMessage,
      baseURL,
      false,
      useCache,
    );
  };

  const GetFile: (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    isPublicFiles?: boolean,
    useCache?: boolean,
  ) => any = async (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    isPublicFiles?: boolean,
    useCache: boolean = false,
  ) => {
    return SendRequest(
      Http.GET,
      url,
      data,
      "blob",
      noErrorMessage,
      baseURL,
      isPublicFiles,
      useCache,
    );
  };

  const PostFile: (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    useCache?: boolean,
  ) => any = async (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    useCache: boolean = false,
  ) => {
    return SendRequest(Http.POST, url, data, "blob", noErrorMessage, baseURL, false, useCache);
  };

  const PostFileWithError: (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    useCache?: boolean,
  ) => any = async (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    useCache: boolean = false,
  ) => {
    return SendRequestWithError(
      Http.POST,
      url,
      data,
      "blob",
      noErrorMessage,
      baseURL,
      useCache,
    );
  };

  const Post: (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    useCache?: boolean,
  ) => any = async (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    useCache: boolean = false,
  ) => {
    return SendRequest(
      Http.POST,
      url,
      data,
      undefined,
      noErrorMessage,
      baseURL,
      false,
      useCache,
    );
  };

  const Put: (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    useCache?: boolean,
  ) => any = async (
    url: string,
    data?: any,
    noErrorMessage?: boolean,
    baseURL?: string | undefined,
    useCache: boolean = false,
  ) => {
    return SendRequest(Http.PUT, url, data, undefined, noErrorMessage, baseURL, false, useCache);
  };

  return {
    Delete,
    isLoading,
    Get,
    Post,
    Put,
    GetFile,
    PostFile,
    PostFileWithError,
    GetWithErrorResponse,
  };
};
