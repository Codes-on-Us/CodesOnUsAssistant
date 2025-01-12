import React, { createContext, FC, ReactNode, useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { IUserAssistant } from "./UserAssistant/UserAssistant";

import { HubConnection } from '@microsoft/signalr/src/HubConnection'
import { UserTrackingConnection, UseUserTracking } from "./UserTracking/UserTracking";

const signalR = require("@microsoft/signalr");

///todo => create tracking assistant


export const UserContext = createContext<[any | undefined, React.Dispatch<React.SetStateAction<string | undefined>>] | undefined>(undefined);
export const UserAssistantContext = createContext<[IUserAssistant, React.Dispatch<React.SetStateAction<IUserAssistant>>] | undefined>(undefined);
export const TrakingConnectionContext = createContext<[HubConnection, React.Dispatch<React.SetStateAction<HubConnection>>] | undefined>(UserTrackingConnection());



export const AssistantProvicer: FC<{
    tracking?: boolean,
    children: ReactNode | ReactNode[]
}> = ({
    children,
    tracking
}) => {

        const userState = useState<any>()
        const UserAssistant = useState<IUserAssistant>({ checkUserInProccess: false, loadUserInProcess: false })
        const trakingConnection = useState<HubConnection>(UserTrackingConnection())
        UseUserTracking({ aciveTracking: tracking })

        return (
            <UserAssistantContext.Provider value={UserAssistant}>
                <UserContext.Provider value={userState}>
                    <TrakingConnectionContext.Provider value={trakingConnection}>
                        {children}
                    </TrakingConnectionContext.Provider>
                    <ToastContainer />
                </UserContext.Provider>
            </UserAssistantContext.Provider>

        )
    }