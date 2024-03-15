// for device token 

import React, { createContext, useState, useEffect } from "react";

const DeviceTokenContext = createContext({
    deviceToken: "",
    setDeviceToken: () => { },
});

function DeviceTokenProvider({ children }) {
    const [deviceToken, setDeviceToken] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("device_token") || "";
        if (token == "") {
            window.api.registerDevice()
                .then((res) => {
                    setDeviceToken(res)
                })
                .catch((e) => {
                    console.log(e)
                })
        }else{
            setDeviceToken(token);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("device_token", deviceToken);
    }, [deviceToken]);

    return (
        <DeviceTokenContext.Provider value={{ deviceToken, setDeviceToken }}>
            {children}
        </DeviceTokenContext.Provider>
    );
}

export { DeviceTokenContext, DeviceTokenProvider };
