import React from 'react'
import { useEffect } from 'react'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ServerListContext } from '../../context/ServerListContext';

const Countries = (props) => {

    const { serverList, setServerList } = React.useContext(ServerListContext);
    let countries = serverList.countries

    useEffect(( ) => {
        if (localStorage.getItem("device_token")) {
            window.api.getCountries(localStorage.getItem("device_token"))
                .then((res) => {
                    localStorage.setItem("country_list", res.data)
                    setServerList((d)=>{
                        return {...d, countries:res.data}
                    })
                })
                .catch((e) => {
                    console.log(e)
                })
        } else { //Todo fix below part by context
            setTimeout(() => {
                window.api.getCountries(localStorage.getItem("device_token"))
                .then((res) => {
                    localStorage.setItem("country_list", res.data)
                    setServerList((d)=>{
                        return {...d, countries:res.data}
                    })
                })
                .catch((e) => {
                    console.log(e)
                })
            }, 3000)
        }

    }, [])

    const handleChange = (event) => {
        props.setSelectedCountryId(event.target.value);
    };


    return (
        <FormControl fullWidth sx={{py:2}}>
            <InputLabel id="country-select-label">country</InputLabel>
            <Select
                labelId="country-select-label"
                id="country-select"
                value={props.selectedCountryId}
                label="country"
                onChange={handleChange}
                sx={{width:"150px"}}
                size='small'

            >
            {Array.isArray(countries) && countries.map((country) => (
                <MenuItem key={country.id} value={country.id}>{country?.name}</MenuItem>
            ))}
            </Select>
        </FormControl>
    )
}

export default Countries