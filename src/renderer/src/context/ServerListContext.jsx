import React from "react";
import { createContext, useState } from "react";

const ServerListContext = createContext({});

function ServerListProvider({ children }) {
    const [serverList, setServerList] = useState([]);

    return (
        <ServerListContext.Provider value={{ serverList, setServerList }}>
            {children}
        </ServerListContext.Provider>
    );
}

export { ServerListContext, ServerListProvider };
