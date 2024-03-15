import React, { createContext, useState, useEffect } from 'react';

export const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
    const initialState = JSON.parse(localStorage.getItem('selected_item')) || { countryId: null, cityId: null };
    const [selectedItems, setSelectedItems] = useState(initialState);

    useEffect(() => {
        localStorage.setItem('selected_item', JSON.stringify(selectedItems));
    }, [selectedItems]);

    return (
        <SelectionContext.Provider value={{ selectedItems, setSelectedItems }}>
            {children}
        </SelectionContext.Provider>
    );
};
