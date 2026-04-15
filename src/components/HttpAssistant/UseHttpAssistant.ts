import { toast } from "react-toastify";
import { Http } from "./Utilities/Http";
import { useHttpClient } from "./Utilities/useHttpClient";
import axios, { AxiosResponse } from "axios";
import { useHttpCache } from "../AssistantProvider";
import { isReduxAvailable, getReduxStore } from "../../store/reduxManager";
import {
  setCacheEntry,
  selectCacheEntry,
} from "../../store/httpCacheSlice";

export const UseHttpAssistant = () => {
  var { isLoading, send } = useHttpClient<any>();
  const { cache, setCache, pendingRequests, setPendingRequests, localPendingRef } =
    useHttpCache();

  // Track if Redux is being used
  const useRedux = isReduxAvailable() && getReduxStore();
  const reduxStore = useRedux ? getReduxStore() : null;

  // Fallback to Context API if Redux not available
  const contextCache = cache;
  const contextSetCache = setCache;
  const contextPendingRequests = pendingRequests;
  const contextSetPendingRequests = setPendingRequests;
  const contextLocalPendingRef = localPendingRef;

  const generateCacheKey = (
    method: Http,
    url: string,
    data?: any,
    baseURL?: string,
  ) => {
    return `${method}:${baseURL || ""}:${url}:${JSON.stringify(data || {})}`;
  };

  // Helper functions to work with Redux or Context
  const getCachedData = (cacheKey: string) => {
    if (useRedux && reduxStore) {
      const state = reduxStore.getState();
      const entry = selectCacheEntry(state, cacheKey);
      return entry?.data;
    }
    return contextCache.get(cacheKey);
  };

  const setPendingInCache = (cacheKey: string, promise: Promise<any>) => {
    // Always use Context API for pending requests (Promises cannot be stored in Redux)
    contextLocalPendingRef.current.set(cacheKey, promise);
    const newPending = new Map(contextPendingRequests);
    newPending.set(cacheKey, promise);
    contextSetPendingRequests(newPending);
  };

  const getCachedPending = (cacheKey: string) => {
    // Always use Context API for pending requests
    return contextLocalPendingRef.current.get(cacheKey);
  };

  const cacheResponseData = (cacheKey: string, data: any) => {
    if (useRedux && reduxStore) {
      reduxStore.dispatch(setCacheEntry({ key: cacheKey, data }));
    } else {
      const newCache = new Map(contextCache);
      newCache.set(cacheKey, data);
      contextSetCache(newCache);
    }
  };

  const removePendingFromCache = (cacheKey: string) => {
    // Always use Context API for pending requests
    contextLocalPendingRef.current.delete(cacheKey);
    const newPending = new Map(contextPendingRequests);
    newPending.delete(cacheKey);
    contextSetPendingRequests(newPending);
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

      // Check cache first
      if (useCache) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData !== undefined) {
          return cachedData;
        }

        // Check pending requests
        const pendingPromise = getCachedPending(cacheKey);
        if (pendingPromise) {
          return pendingPromise;
        }
      }

      const requestPromise = (async () => {
        try {
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
            cacheResponseData(cacheKey, response);
          }

          return response;
        } finally {
          if (useCache) {
            removePendingFromCache(cacheKey);
          }
        }
      })();

      if (useCache) {
        setPendingInCache(cacheKey, requestPromise);
      }

      return requestPromise;
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

    // Check cache first
    if (useCache) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData !== undefined) {
        return { response: cachedData, error: null };
      }

      // Check pending requests
      const pendingPromise = getCachedPending(cacheKey);
      if (pendingPromise) {
        const result = await pendingPromise;
        return { response: result, error: null };
      }
    }

    const requestPromise = (async () => {
      try {
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
          cacheResponseData(cacheKey, response);
        }

        return { response, error };
      } finally {
        if (useCache) {
          removePendingFromCache(cacheKey);
        }
      }
    })();

    if (useCache) {
      setPendingInCache(cacheKey, requestPromise);
    }

    return requestPromise;
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
    return SendRequest(
      Http.GET,
      url,
      data,
      undefined,
      noErrorMessage,
      baseURL,
      false,
      useCache,
    );
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
    return SendRequest(
      Http.POST,
      url,
      data,
      "blob",
      noErrorMessage,
      baseURL,
      false,
      useCache,
    );
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
    return SendRequest(
      Http.PUT,
      url,
      data,
      undefined,
      noErrorMessage,
      baseURL,
      false,
      useCache,
    );
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
