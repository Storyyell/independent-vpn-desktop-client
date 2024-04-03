import { Button, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import BoltIcon from '@mui/icons-material/Bolt';



const SearchBar = (props) => {

  let searchField = props.searchField
  let setSearchField = props.setSearchField
  let loadCityList = props.loadCityList
  let favIconClick = props.favIconClick
  let setFavList = props.setFavList

  const handleResetFav = () => {
    setFavList({ countries: [], cities: {} })
  }

  return (
    <>
      <Button variant='contained' size='small' color='error'>
        <BoltIcon color='white' fontSize='small' />
        <Typography sx={{ color: 'white' }} style={{ fontSize: '15px' }}> Quick Select </Typography>
      </Button>

      <TextField id="search" label={`search ${loadCityList ? 'cities' : 'countries'}`} variant="outlined"
        value={searchField}
        size='small'
        onChange={(e) => {
          setSearchField(e.target.value)
        }} />

      {favIconClick && <Stack style={{ margin: '5px' }} justifyContent={'flex-end'} sx={{ width: '100%' }} flexDirection={'row'}>
        <Button variant='text' color='error' size='small' sx={{ mx: 2 }}
          onClick={() => { handleResetFav() }}>
          reset favourities
        </Button>
      </Stack>}

    </>
  )
}

export default SearchBar