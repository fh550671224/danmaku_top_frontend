import {useState} from "react";
import {stringify} from "node:querystring";

type MessageBarProps = {
    info: (txt: string) => void
    error: (txt: string) => void
    warning: (txt: string) => void
}

export const MessageBar = (props: MessageBarProps) => {
    
}