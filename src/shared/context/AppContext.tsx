import { createContext } from "react";
import ModalData from "../types/ModalData";

type AppContextType = {
    navigate: (href:string) => void,
    user: string|null,
    setUser: (user:string) => void,
    request: (url:string, ini:any) => Promise<any>,
    showModal: (data:ModalData) => void
};

const init: AppContextType = {
    navigate: (_:string) => { throw "navigate not implemented"; },
    user: null,
    setUser: (_:string) => { throw "setUser not implemented"; },
    request: (_:string, __:any) => { throw "request not implemented"; },
    showModal: (_:ModalData) => { throw "showModal not implemented"; }
}


export const AppContext = createContext<AppContextType>(init);
