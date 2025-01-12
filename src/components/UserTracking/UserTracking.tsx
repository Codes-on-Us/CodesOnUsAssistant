import { FC, useContext, useEffect } from "react"
import { AciveTrackingContext, TrakingConnectionContext } from "../AssistantProvider";
import React from "react";

const signalR = require("@microsoft/signalr");

export const UserTracking: FC<{ aciveTracking?: boolean }> = ({
    aciveTracking
}) => {

    UseUserTracking()

    const aciveTrackingState = useContext(AciveTrackingContext)
    useEffect(() => {
        aciveTrackingState?.[1](aciveTracking === true)
    }, [aciveTracking])

    return <></>
}

export const UseUserTracking = () => {

    const aciveTracking = useContext(AciveTrackingContext)?.[0] === true
    const TrakingConnection = useContext(TrakingConnectionContext)


    const Stop = () => {
        TrakingConnection?.[1] && TrakingConnection?.[1]((s) => {
            s?.stop()
            return s
        })
    }

    const Start = () => {
        TrakingConnection?.[1] && TrakingConnection?.[1]((s) => {
            s?.start();
            return s
        })
    }

    const CheckTraking = async () => {

        if (!TrakingConnection?.[0]) {
            return;
        }

        if (aciveTracking !== true && TrakingConnection?.[0].state === signalR.HubConnectionState.Connected) {
            Stop()
            return;
        }

        if (TrakingConnection?.[0].state === signalR.HubConnectionState.Disconnected) {
            console.log('start');
            Start()
            return
        }
    }

    useEffect(() => {
        if (aciveTracking) {
            console.log("tacking  state => " + TrakingConnection?.[0]?.state);
        }

    }, [TrakingConnection?.[0]?.state])


    useEffect(() => {
        void CheckTraking()
    }, [aciveTracking, TrakingConnection?.[0]])


    const UserTrackingConnection = () => {

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_USERTRAKING_ADDRESS,
                {
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets
                }
            )
            .build()

        connection.on("receive", (data: any) => {
            console.log("Received:", data);
        });

        return connection

    }

    useEffect(() => {
        if (!TrakingConnection?.[0])
            TrakingConnection?.[1](UserTrackingConnection())
    }, [])


    const LogAsync = async (props: UserTrackingLogMessage) => {

        if (aciveTracking !== true || !TrakingConnection?.[0] || TrakingConnection?.[0]?.state !== signalR.HubConnectionState.Connected) {
            console.log("refuse to log =>" + TrakingConnection?.[0]?.state);
            return
        }

        await TrakingConnection?.[0].invoke("SendMessageAsync", JSON.stringify(props));
        console.log("Message sent successfully.");
    }

    const LogAndForget = (props: UserTrackingLogMessage) => {
        setTimeout(async () => {
            await LogAsync(props)
        }, 1);
    }

    return {
        LogAsync,
        LogAndForget
    }
}

export interface UserTrackingLogMessage {
    message: string,
    url?: string,
    response?: string,
    error?: string
}
