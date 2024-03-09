import React from 'react'
import { useEffect } from 'react'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const City = (props) => {

    const [cities, setCities] = React.useState(localStorage.getItem("city_list") ? localStorage.getItem("city_list") : [])

    useEffect(() => {
        props.setSelectedCityId('')
        setCities([])
        if(props.selectedCountryId){
            window.api.getCities(localStorage.getItem("device_token"), props.selectedCountryId)
            .then((res) => {
                localStorage.setItem("city_list", res)
                setCities(res.data)
            })
            .catch((e) => {
                console.log(e)
            })
        }

    }, [props.selectedCountryId])

    const handleChange = (event) => {
        props.setSelectedCityId(event.target.value);
    };

    return (
        <>
        <FormControl fullWidth sx={{py:2}}>
            <InputLabel id="city-select-label">city</InputLabel>
            <Select
                labelId="city-select-label"
                id="city-select"
                value={props.selectedCityId}
                label="city"
                onChange={handleChange}
                sx={{width:"150px"}}
                size='small'
            >
            {Array.isArray(cities) && cities.map((city) => (
                <MenuItem key={city.id} value={city.id}>{city?.name}</MenuItem>
            ))}
            </Select>
        </FormControl>
        </>
    )
}

export default City