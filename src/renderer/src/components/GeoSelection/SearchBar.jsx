import { Button, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import BoltIcon from '@mui/icons-material/Bolt';
import { SelectionContext } from '../../context/SelectionContext';
import { handleVpnConnTrigger } from '../../pages/Home/ConnectionTrigger';
import { VpnStatusMainContext } from '../../context/VpnStatusMainContext';



const SearchBar = (props) => {

  const { selectedItems, setSelectedItems } = React.useContext(SelectionContext);
  const { vpnStatusMain, setVpnStatusMain } = React.useContext(VpnStatusMainContext);


  let searchField = props.searchField
  let setSearchField = props.setSearchField
  let loadCityList = props.loadCityList
  let favIconClick = props.favIconClick
  let setFavList = props.setFavList
  let setLoadCityList = props.setLoadCityList

  let serverList = props.serverList
  let deviceToken = props.deviceToken
  let setServerList = props.setServerList



  const handleResetFav = () => {
    setFavList({ countries: [], cities: {} })
  }

  const handleQuickSelect = () => {
    props.onClose()
    setSelectedItems({ countryId: null, cityId: null })
    setLoadCityList(false)
    handleVpnConnTrigger(deviceToken, selectedItems, serverList, () => { }, vpnStatusMain, setServerList, setVpnStatusMain, setSelectedItems)
  }

  return (
    <>
      <Button variant='contained' size='small' color='error'
        onClick={() => { handleQuickSelect() }}
      >
        <BoltIcon color='white' fontSize='small' />
        <Typography sx={{ color: 'white' }} style={{ fontSize: '15px' }}> Quick Select </Typography>
      </Button>

      <TextField id="search" label={`search ${loadCityList ? 'cities' : 'countries'}`} variant="outlined"
        value={searchField}
        size='small'
        onChange={(e) => {
          setSearchField(e.target.value)
        }} />

      {favIconClick && <Stack style={{ padding: '5px' }} justifyContent={'flex-end'} sx={{ width: '100%' }} flexDirection={'row'}>
        <Button variant='text' color='error' size='small' sx={{ px: 2 }}
          onClick={() => { handleResetFav() }}>
          reset favourities
        </Button>
      </Stack>}

    </>
  )
}

export default SearchBar