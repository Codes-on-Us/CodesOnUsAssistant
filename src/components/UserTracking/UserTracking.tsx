import {HubConnectionState } from "@microsoft/signalr/src/HubConnection"
import React, { useContext, useEffect } from "react"
import { TrakingConnectionContext } from "../AssistantProvider";
const signalR = require("@microsoft/signalr");


export const UseUserTracking = (props: { aciveTracking?: boolean }) => {

    var { aciveTracking } = props
    const TrakingConnection = useContext(TrakingConnectionContext)
    const TrakingConnectionState = TrakingConnection?.[0]
    const SetTrakingConnection = TrakingConnection?.[1]

    const Stop = () => {
        SetTrakingConnection && SetTrakingConnection((s) => {
            s?.stop()
            return s
        })
    }

    const Start = () => {
        SetTrakingConnection && SetTrakingConnection((s) => {
            s?.start();
            return s
        })
    }

    const CheckTraking = async () => {

        if (!TrakingConnectionState)
            return;

        if (aciveTracking === undefined && aciveTracking === false && TrakingConnectionState.state !== HubConnectionState.Connected) {
            Stop()
            return;
        }

        if (TrakingConnectionState.state !== HubConnectionState.Connected) {
            Start()
        }

    }

    useEffect(() => {
        void CheckTraking()
    }, [aciveTracking])

}



export const UserTrackingConnection = () => new signalR.HubConnectionBuilder()
    .withUrl(process.env.REACT_APP_USERTRAKING_ADDRESS)
    .build()