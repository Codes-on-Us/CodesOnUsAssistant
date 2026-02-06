import React, { createContext, FC, ReactNode, useState } from "react";
import { ToastContainer } from "react-toastify";
import { IUserAssistant } from "./UserAssistant/UserAssistant";
import { HubConnection } from '@microsoft/signalr/src/HubConnection'

export const UserContext = createContext<[any | undefined, React.Dispatch<React.SetStateAction<string | undefined>>] | undefined>(undefined);
export const UserAssistantContext = createContext<[IUserAssistant, React.Dispatch<React.SetStateAction<IUserAssistant>>] | undefined>(undefined);

export const TrakingConnectionContext = createContext<[HubConnection | undefined, React.Dispatch<React.SetStateAction<HubConnection | undefined>>] | undefined>(undefined);
export const AciveTrackingContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined);

export const HttpCacheContext = createContext<[Map<string, any>, React.Dispatch<React.SetStateAction<Map<string, any>>>] | undefined>(undefined);


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


        return (
            <UserAssistantContext.Provider value={UserAssistant}>
                <UserContext.Provider value={userState}>
                    <TrakingConnectionContext.Provider value={trakingConnection}>
                        <AciveTrackingContext.Provider value={aciveTrackingState}>
                            <HttpCacheContext.Provider value={httpCacheState}>
                                {children}
                                <ToastContainer />
                                {/* <UserTracking aciveTracking={tracking} /> */}
                            </HttpCacheContext.Provider>
                        </AciveTrackingContext.Provider>
                    </TrakingConnectionContext.Provider>
                </UserContext.Provider>
            </UserAssistantContext.Provider>

        )
    }