import React, { createContext, useState, useEffect } from "react";

const ServerListContext = createContext({});

function ServerListProvider({ children }) {
    const initialState = JSON.parse(localStorage.getItem('server_list')) || { countries: [], cities: {}, servers: [] };
    const [serverList, setServerList] = useState(initialState);

    useEffect(() => {
        localStorage.setItem('server_list', JSON.stringify(serverList));
    }, [serverList]);

    return (
        <ServerListContext.Provider value={{ serverList, setServerList }}>
            {children}
        </ServerListContext.Provider>
    );
}

export { ServerListContext, ServerListProvider };
