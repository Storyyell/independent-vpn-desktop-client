import React, { createContext, useState, useEffect } from "react";

const DnsListContext = createContext({});

function DnsListProvider({ children }) {
    const initialState = JSON.parse(localStorage.getItem('dns_list')) || { dnsList: [], selectedDns: '' };
    const [dnsObj, setDnsObj] = useState(initialState);

    useEffect(() => {
        try {
            const jsonStr = JSON.stringify(dnsObj);
            localStorage.setItem('dns_list', jsonStr);

        } catch (error) {
            // console.error('Error saving to local storage', error);
        }
    }, [dnsObj]);

    return (
        <DnsListContext.Provider value={{ dnsObj, setDnsObj }}>
            {children}
        </DnsListContext.Provider>
    );
}

export { DnsListContext, DnsListProvider };
