import React, { createContext, useState, useEffect } from "react";

const FavListContext = createContext({});

function FavListProvider({ children }) {
    const initialState = JSON.parse(localStorage.getItem('fav_list')) || { countries: [], cities: {} };
    const [favList, setFavList] = useState(initialState);

    useEffect(() => {
        localStorage.setItem('fav_list', JSON.stringify(favList));
    }, [favList]);

    return (
        <FavListContext.Provider value={{ favList, setFavList }}>
            {children}
        </FavListContext.Provider>
    );
}

export { FavListContext, FavListProvider };
