import React, { createContext, FC, ReactNode, useState } from "react";
import { ToastContainer } from "react-toastify";
import { IUserAssistant } from "./UserAssistant/UserAssistant";
import { HubConnection } from '@microsoft/signalr/src/HubConnection'
import { UserTracking } from "./UserTracking/UserTracking";

export const UserContext = createContext<[any | undefined, React.Dispatch<React.SetStateAction<string | undefined>>] | undefined>(undefined);
export const UserAssistantContext = createContext<[IUserAssistant, React.Dispatch<React.SetStateAction<IUserAssistant>>] | undefined>(undefined);

export const TrakingConnectionContext = createContext<[HubConnection | undefined, React.Dispatch<React.SetStateAction<HubConnection | undefined>>] | undefined>(undefined);
export const AciveTrackingContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined);


export const AssistantProvicer: FC<{
    tracking?: boolean,
    children: ReactNode | ReactNode[]
}> = ({
    children,
    tracking
}) => {

        const userState = useState<any>()
        const UserAssistant = useState<IUserAssistant>({ checkUserInProccess: false, loadUserInProcess: false })

        const trakingConnection = useState<HubConnection>()
        const aciveTrackingState = useState(false)


        return (
            <UserAssistantContext.Provider value={UserAssistant}>
                <UserContext.Provider value={userState}>
                    <TrakingConnectionContext.Provider value={trakingConnection}>
                        <AciveTrackingContext.Provider value={aciveTrackingState}>
                            {children}
                            <ToastContainer />
                            <UserTracking aciveTracking={tracking} />
                        </AciveTrackingContext.Provider>
                    </TrakingConnectionContext.Provider>
                </UserContext.Provider>
            </UserAssistantContext.Provider>

        )
    }