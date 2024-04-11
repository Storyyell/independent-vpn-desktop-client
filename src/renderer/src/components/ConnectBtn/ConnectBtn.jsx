import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import './ConnectBtn.css'
import CircularProgress from '@mui/material/CircularProgress';
import { VpnStatusMainContext } from '../../context/VpnStatusMainContext';

const PowerBtn = () => {
  return (
    <Box>
      <svg width="42" height="41" viewBox="0 0 42 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="Vector" d="M21.0001 5.31677C20.0804 5.31677 19.3279 6.06925 19.3279 6.98894V20.3663C19.3279 21.286 20.0804 22.0384 21.0001 22.0384C21.9198 22.0384 22.6723 21.286 22.6723 20.3663V6.98894C22.6723 6.06925 21.9198 5.31677 21.0001 5.31677ZM29.595 10.0992C29.2875 10.4067 29.1133 10.823 29.1101 11.2579C29.107 11.6928 29.2752 12.1115 29.5783 12.4235C31.4679 14.4301 32.6384 17.1056 32.7053 20.0653C32.8558 26.4697 27.555 31.9878 21.1506 32.0547C19.6011 32.0789 18.0623 31.7944 16.6239 31.2176C15.1855 30.6409 13.8764 29.7835 12.7728 28.6955C11.6692 27.6075 10.7934 26.3107 10.1963 24.8806C9.59914 23.4506 9.29274 21.916 9.29492 20.3663C9.29492 17.2895 10.4822 14.497 12.4219 12.4068C13.0406 11.7546 13.0406 10.7346 12.4052 10.0992C12.248 9.94059 12.0605 9.81533 11.8539 9.73087C11.6472 9.64641 11.4257 9.60449 11.2024 9.60761C10.9792 9.61073 10.7589 9.65883 10.5547 9.74904C10.3505 9.83924 10.1666 9.9697 10.014 10.1326C7.50453 12.7907 6.05856 16.2777 5.95059 19.9315C5.71648 28.0917 12.355 35.1482 20.5152 35.3991C29.0432 35.6666 36.0496 28.8274 36.0496 20.3496C36.0496 16.3865 34.5112 12.8081 32.003 10.1326C31.3675 9.44703 30.2639 9.4303 29.595 10.0992Z" fill="white" />
      </svg>
    </Box>
  )
}

const ConnectBtn = (props) => {
  const { vpnStatusMain } = React.useContext(VpnStatusMainContext);


  let btnStyle = {}

  switch (vpnStatusMain) {

    case 'connected':
      btnStyle = {
        background: 'linear-gradient(62deg, #430003 -10.14%, #CC2229 108.2%)'
      }
      break;
    case 'connecting':
      btnStyle = {
        animation: 'shadow-pulse 2s infinite'
      }
      break;
    case 'disconnecting':
      btnStyle = {
        animation: 'shadow-pulse 2s infinite'
      }
      break;
    default:
      btnStyle = {}

  }


  return (
    <>
      <Stack
        direction={'column'}
        className='btnStyle'
        style={btnStyle}
        onClick={props.onClick}
        sx={{
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)'
          },
        }}>
        {
          ((vpnStatusMain == 'connecting') || (vpnStatusMain == 'disconnecting')) ? <CircularProgress size={41} sx={{ p: 1 }} color='error' /> : <PowerBtn />
        }
        <Typography style={{ fontSize: '10px', fontWeight: '600' }}>
          {vpnStatusMain === 'connected' && 'Connected'}
          {vpnStatusMain === 'disconnected' && 'Tap to connect'}
          {vpnStatusMain === 'connecting' && 'connecting...'}
          {vpnStatusMain === 'disconnecting' && 'disconnecting...'}
        </Typography>
        <Typography sx={{ color: '#888888', fontSize: '8.779px', fontWeight: '6pp' }}>
          {props.ip}
        </Typography>
      </Stack>
    </>
  )
}


export default ConnectBtn


