import React, { createContext, FC, ReactNode, useState, useContext, useRef, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { IUserAssistant } from "./UserAssistant/UserAssistant";
import { HubConnection } from '@microsoft/signalr/src/HubConnection'

export const UserContext = createContext<[any | undefined, React.Dispatch<React.SetStateAction<string | undefined>>] | undefined>(undefined);
export const UserAssistantContext = createContext<[IUserAssistant, React.Dispatch<React.SetStateAction<IUserAssistant>>] | undefined>(undefined);

export const TrakingConnectionContext = createContext<[HubConnection | undefined, React.Dispatch<React.SetStateAction<HubConnection | undefined>>] | undefined>(undefined);
export const AciveTrackingContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined);

export const HttpCacheContext = createContext<[Map<string, any>, React.Dispatch<React.SetStateAction<Map<string, any>>>] | undefined>(undefined);
export const HttpPendingContext = createContext<[Map<string, Promise<any>>, React.Dispatch<React.SetStateAction<Map<string, Promise<any>>>>] | undefined>(undefined);
export const HttpLocalPendingContext = createContext<React.MutableRefObject<Map<string, Promise<any>>> | undefined>(undefined);
export const HttpLocalCacheContext = createContext<React.MutableRefObject<Map<string, any>> | undefined>(undefined);

export const useHttpCache = () => {
  const cacheContext = useContext(HttpCacheContext);
  const pendingContext = useContext(HttpPendingContext);
  const localPendingContext = useContext(HttpLocalPendingContext);
  const localCacheContext = useContext(HttpLocalCacheContext);

  return {
    cache: cacheContext?.[0] || new Map(),
    setCache: cacheContext?.[1] || (() => {}),
    pendingRequests: pendingContext?.[0] || new Map(),
    setPendingRequests: pendingContext?.[1] || (() => {}),
    localPendingRef: localPendingContext || { current: new Map() },
    localCacheRef: localCacheContext || { current: new Map() },
  };
};


export const AssistantProvicer: FC<{
    tracking?: boolean,
    children: ReactNode | ReactNode[]
}> = ({
    children
}) => {

        const userState = useState<any>()
        const UserAssistant = useState<IUserAssistant>({ checkUserInProccess: false, loadUserInProcess: false })

        const trakingConnection = useState<HubConnection>()
        const aciveTrackingState = useState(false)
        const httpCacheState = useState<Map<string, any>>(new Map())
        const httpPendingState = useState<Map<string, Promise<any>>>(new Map())
        const httpLocalPendingRef = useRef<Map<string, Promise<any>>>(new Map())
        const httpLocalCacheRef = useRef<Map<string, any>>(new Map())

        // Initialize Redux if available
        useEffect(() => {
          try {
            const { initializeReduxStore } = require('../store/reduxManager');
            initializeReduxStore();
          } catch (error) {
            // Redux not available, will fall back to Context API
          }
        }, [])


        return (
            <UserAssistantContext.Provider value={UserAssistant}>
                <UserContext.Provider value={userState}>
                    <TrakingConnectionContext.Provider value={trakingConnection}>
                        <AciveTrackingContext.Provider value={aciveTrackingState}>
                            <HttpCacheContext.Provider value={httpCacheState}>
                                <HttpPendingContext.Provider value={httpPendingState}>
                                    <HttpLocalPendingContext.Provider value={httpLocalPendingRef}>
                                        <HttpLocalCacheContext.Provider value={httpLocalCacheRef}>
                                            {children}
                                            <ToastContainer />
                                            {/* <UserTracking aciveTracking={tracking} /> */}
                                        </HttpLocalCacheContext.Provider>
                                    </HttpLocalPendingContext.Provider>
                                </HttpPendingContext.Provider>
                            </HttpCacheContext.Provider>
                        </AciveTrackingContext.Provider>
                    </TrakingConnectionContext.Provider>
                </UserContext.Provider>
            </UserAssistantContext.Provider>

        )
    }