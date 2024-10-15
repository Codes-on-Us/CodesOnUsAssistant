import React, { FC } from "react"
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styled from "styled-components";



interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    size?: "small" | "normal" | "big",
    schema?: "blue" | "cyan" | "red",
    startIcon?: ReactNode
}
export const Button: FC<Props> = (props) => {
    const { size = "normal", schema = "blue" } = props

    const SmallButtons = styled.button<{
        $backhroudColor?: string,
        $color: string,
        $fontSize: string,
        $padding?: string,
        $fontWieght?: string,
        $height?: string
    }>`
        background-color: ${props => props.$backhroudColor};
        color: ${props => props.$color};
        font-size:${props => props.$fontSize};
        border-radius: 4px;
        border: 0;
        padding: ${props => props.$padding ?? "5px 10px"} ;
        cursor: pointer;
        font-weight: ${props => props.$fontWieght ? props.$fontWieght : ""} ;
        height: ${props => props.$height ? props.$height : ""}  ;
        display: inline-flex;
        gap: 5px;
        align-items: center;

        svg{
            font-size: 25px
        }
`;


    if (size === "small" && schema === "cyan")
        return <SmallButtons $fontSize="13px" $color="#fff" $backhroudColor="#159bb3" {...props} > {props.startIcon}{props.children} </SmallButtons>

    if (size === "normal" && schema === "cyan")
        return <SmallButtons
            $fontSize="16px"
            $height="32px"
            $fontWieght="500"
            $padding="0px 15px"
            $color="#fff"
            $backhroudColor="#159bb3"
            {...props} > {props.startIcon}{props.children} </SmallButtons>




    if (size === "small" && schema === "red")
        return <SmallButtons $fontSize="13px" $color="#fff" $backhroudColor="rgb(220, 0, 78)" {...props} > {props.startIcon}{props.children} </SmallButtons>

    if (size === "normal" && schema === "red")
        return <SmallButtons
            $fontSize="16px"
            $height="32px"
            $fontWieght="500"
            $padding="0px 15px"
            $color="#fff"
            $backhroudColor="rgb(220, 0, 78)"
            {...props} > {props.startIcon}{props.children} </SmallButtons>






    return <button {...props} className={[size, schema].join(" ")} > sd</button >
}
