import { Box, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import favIcon from '../../assets/favIcon.svg';


const GeoSelHeader = (props) => {
  let favIconClick = props.favIconClick
  let setFavIconClick = props.setFavIconClick
  let mentIconStyle = props.mentIconStyle
  let loadCityList = props.loadCityList
  let setLoadCityList = props.setLoadCityList
  let setSelectedItems = props.setSelectedItems


  const FavIcon = (props) => {
    return (
      <IconButton onClick={() => {
        props?.setFavIconClick(!props?.favIconClick)
      }}
        sx={{ visibility: props?.loadCityList ? 'hidden' : 'visible' }}
      >
        <Box style={{ ...props.mentIconStyle, backgroundColor: props.favIconClick ? 'red' : 'none' }} sx={{ b: 1 }} >
          <img alt="favicon" src={favIcon} loading="lazy" width={'19px'} />
        </Box>
      </IconButton>
    )

  }



  return (
    <>
      <Stack direction={'row'} width={'100%'} style={{ justifyContent: 'space-between', alignItems: 'center', }}>

        <IconButton onClick={() => {
          if (loadCityList) {
            setSelectedItems((d) => {
              return { ...d, cityId: '' }
            })
            setLoadCityList(false)
          } else {
            props.onClose()
          }
        }}>
          {loadCityList ? <ArrowBackIcon /> : <CloseIcon />}
        </IconButton>

        {favIconClick && <Typography style={{ fontSize: '16px' }}>Favourites</Typography>}

        {<FavIcon favIconClick={favIconClick} setFavIconClick={setFavIconClick} mentIconStyle={mentIconStyle} loadCityList={loadCityList} />}

      </Stack>
    </>
  )
}

export default GeoSelHeader