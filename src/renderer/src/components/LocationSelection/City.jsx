import React from 'react'
import { useEffect } from 'react'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ServerListContext } from '../../context/ServerListContext';
import { DeviceTokenContext } from '../../context/DeviceTokenContext';
import { SelectionContext } from '../../context/SelectionContext';

const City = (props) => {

    const { serverList, setServerList } = React.useContext(ServerListContext);
    const {deviceToken, setDeviceToken} = React.useContext(DeviceTokenContext);
    const { selectedItems, setSelectedItems } = React.useContext(SelectionContext);

    let cities=serverList?.cities[selectedItems?.countryId] || []

    useEffect(() => {
        if(selectedItems?.countryId && deviceToken){
            window.api.getCities(deviceToken, selectedItems?.countryId)
            .then((res) => {
                setServerList((d)=>{
                    return {...d, cities:{
                        ...d.cities,
                        [selectedItems?.countryId]:res.data
                    }}
                })
            })
            .catch((e) => {
                console.log(e)
            })
        }

    }, [selectedItems?.countryId, deviceToken])

    const handleChange = (event) => {
        setSelectedItems((d)=>{
            return {...d, cityId: event.target.value}
        })
        if(deviceToken && selectedItems?.countryId && event.target.value){
            window.api.getServers(deviceToken, selectedItems?.countryId, event.target.value)
            .then((res) => {
                setServerList((d)=>{
                    return {...d, servers:res.data}
                })
            })
            .catch((e) => {
                console.log(e)
            })
        }
    };

    return (
        <>
        <FormControl fullWidth sx={{py:2}}>
            <InputLabel id="city-select-label">city</InputLabel>
            <Select
                labelId="city-select-label"
                id="city-select"
                value={selectedItems.cityId}
                label="city"
                onChange={handleChange}
                sx={{width:"150px"}}
                size='small'
            >
            {cities.map((city) => (
                <MenuItem key={city.id} value={city.id}>{city?.name}</MenuItem>
            ))}
            </Select>
        </FormControl>
        </>
    )
}

export default City