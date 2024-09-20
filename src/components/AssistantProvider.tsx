import React, { createContext, FC, ReactNode, useState } from "react";
import { ToastContainer } from "react-toastify";
import { IUserAssistant } from "./UserAssistant/UserAssistant";

export const UserContext = createContext<[any | undefined, React.Dispatch<React.SetStateAction<string | undefined>>] | undefined>(undefined);

export const UserAssistantContext = createContext<[IUserAssistant, React.Dispatch<React.SetStateAction<IUserAssistant>>] | undefined>(undefined);

export const AssistantProvicer: FC<{
    children: ReactNode | ReactNode[]
}> = ({
    children
}) => {

        const userState = useState<any>()
        const UserAssistant = useState<IUserAssistant>({ checkUserInProccess: false, loadUserInProcess: false })

        return (

            <UserAssistantContext.Provider value={UserAssistant}>
                <UserContext.Provider value={userState}>
                    {children}
                    <ToastContainer />
                </UserContext.Provider>
            </UserAssistantContext.Provider>

        )
    }