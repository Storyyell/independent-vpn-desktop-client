import React, { createContext, useState, useEffect } from "react";

const ServerListContext = createContext({});

function ServerListProvider({ children }) {
    const initialState = JSON.parse(localStorage.getItem('server_list')) || { countries: [], cities: {}, servers: [] };
    const [serverList, setServerList] = useState(initialState);

    useEffect(() => {
        try {
            const jsonStr = JSON.stringify(serverList);
            localStorage.setItem('server_list', jsonStr);

        } catch (error) {
            // console.error('Error saving to local storage', error);
        }
    }, [serverList]);

    return (
        <ServerListContext.Provider value={{ serverList, setServerList }}>
            {children}
        </ServerListContext.Provider>
    );
}

export { ServerListContext, ServerListProvider };
