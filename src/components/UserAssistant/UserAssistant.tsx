import { useContext } from "react"
import { UserAssistantContext, UserContext } from "../AssistantProvider";
import { UseHttpAssistant } from "../HttpAssistant/UseHttpAssistant";


export const UseUserAssistant = () => {

    const userState = useContext(UserContext);
    var { Get, Put } = UseHttpAssistant()
    const userAssistantState = useContext(UserAssistantContext);
    const checkUserInProccess = userAssistantState?.[0]?.checkUserInProccess
    const loadUserInProcess = userAssistantState?.[0]?.loadUserInProcess

    const UpdateUser = (newUser: any | undefined) => {
        userState?.[1](newUser)
    }

    const checkUserTokenAndLoadUser = async () => {

        if (checkUserInProccess === true) return;

        userAssistantState?.[1](c => {
            if (c)
                c.loadUserInProcess = true;
            return c
        })

        const response = await Get("/Auth/Ping", undefined, true);

        userAssistantState?.[1](c => {
            if (c)
                c.loadUserInProcess = false;
            return c
        })


        if (response) {
            var res = response as {
                value: any;
                failed: boolean;
                message: string | null;
            };

            if (res.failed === false) {
                UpdateUser(res.value)
            }

        }

    }


    const RefreshToken = async () => {

        if (checkUserInProccess === true) return;

        userAssistantState?.[1](c => {
            if (c)
                c.loadUserInProcess = true;
            return c
        })


        await Put("/Auth/RefreshTokenWithCookies");

        userAssistantState?.[1](c => {
            if (c)
                c.loadUserInProcess = false;
            return c
        })

    }

    return {
        user: userState?.[0],
        logout: () => UpdateUser(undefined),
        updateUser: UpdateUser,
        checkUserTokenAndLoadUser,
        checkUserInProccess,
        RefreshToken
    }
}

export interface IUserAssistant {
    checkUserInProccess: boolean,
    loadUserInProcess: boolean
}