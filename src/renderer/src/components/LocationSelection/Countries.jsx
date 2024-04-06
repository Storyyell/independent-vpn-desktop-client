import React from 'react'
import { useEffect } from 'react'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ServerListContext } from '../../context/ServerListContext';
import { DeviceTokenContext } from '../../context/DeviceTokenContext';
import { SelectionContext } from '../../context/SelectionContext';
import { refreshCountryList } from '../../scripts/utils';

const Countries = (props) => {

    const { serverList, setServerList } = React.useContext(ServerListContext);
    const { deviceToken, setDeviceToken } = React.useContext(DeviceTokenContext);
    const { selectedItems, setSelectedItems } = React.useContext(SelectionContext);


    let countries = serverList.countries

    useEffect(() => {
        refreshCountryList(deviceToken, setServerList);
    }, [deviceToken])

    const handleChange = (event) => {
        setSelectedItems((d) => {
            return { ...d, countryId: event.target.value, cityId: '' }
        })

    };


    return (
        <FormControl fullWidth sx={{ py: 2 }}>
            <InputLabel id="country-select-label">country</InputLabel>
            <Select
                labelId="country-select-label"
                id="country-select"
                value={selectedItems.countryId}
                label="country"
                onChange={handleChange}
                sx={{ width: "150px" }}
                size='small'
            >
                {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>{country?.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default Countries