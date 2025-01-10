import React, { createContext, FC, ReactNode, useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { IUserAssistant } from "./UserAssistant/UserAssistant";
const signalR = require("@microsoft/signalr");
import { HubConnection } from '@microsoft/signalr/src/HubConnection'

///todo => create tracking assistant

export const UserContext = createContext<[any | undefined, React.Dispatch<React.SetStateAction<string | undefined>>] | undefined>(undefined);
export const UserAssistantContext = createContext<[IUserAssistant, React.Dispatch<React.SetStateAction<IUserAssistant>>] | undefined>(undefined);
export const TrakingConnectionContext = createContext<[HubConnection, React.Dispatch<React.SetStateAction<HubConnection>>] | undefined>(undefined);


export const AssistantProvicer: FC<{
    tracking?: boolean,
    children: ReactNode | ReactNode[]
}> = ({
    children,
    tracking
}) => {

        const userState = useState<any>()
        const UserAssistant = useState<IUserAssistant>({ checkUserInProccess: false, loadUserInProcess: false })
        const trakingConnection = useState<HubConnection>(new signalR.HubConnectionBuilder()
            .withUrl("https://localbridge.navid-sharifi.ir/Bridge")
            .build())



        const CheckTraking = async () => {

            if (tracking === undefined && tracking === false && trakingConnection[0].state !== signalR.HubConnectionState.Connected) {
                await trakingConnection[0]?.stop()
                return;
            }

            if (trakingConnection[0]?.state !== signalR.HubConnectionState.Connected) {
                await trakingConnection[0].start();
            }
        }


        useEffect(() => {
            void CheckTraking()
        }, [tracking])

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