import React, { createContext, useState, useEffect } from "react";

const DnsListContext = createContext({});

function DnsListProvider({ children }) {
    const initialState = JSON.parse(localStorage.getItem('dns_list')) || { dnsList: [], selectedDns: '' };
    const [dnsList, setDnsList] = useState(initialState);

    useEffect(() => {
        try {
            const jsonStr = JSON.stringify(dnsList);
            localStorage.setItem('dns_list', jsonStr);

        } catch (error) {
            // console.error('Error saving to local storage', error);
        }
    }, [dnsList]);

    return (
        <DnsListContext.Provider value={{ dnsList, setDnsList }}>
            {children}
        </DnsListContext.Provider>
    );
}

export { DnsListContext, DnsListProvider };
