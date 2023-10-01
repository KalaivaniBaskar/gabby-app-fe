import { createContext, useState, useContext } from "react";

const CtxContext = createContext({});

export const ContextProvider = ({children}) => {

    const [user, setUser] = useState({
        id: "",
        username: "",
        email : "",
        phone: "",
        contacts : []
    }); 
    const [chatUser, setChatUser] = useState("")
    const [contactList, setContactList] = useState([]);
    const [isDraw, setIsDraw] = useState(false)
    const [room, setRoom] = useState("")

    return (
        <CtxContext.Provider value={{ user, setUser, 
        chatUser, setChatUser,contactList, setContactList,
        isDraw, setIsDraw, room, setRoom }}>
            {children}
        </CtxContext.Provider>
    )
}
export default CtxContext; 

export const useCTX = () => {
    return useContext(CtxContext);
}
