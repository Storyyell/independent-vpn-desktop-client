import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import './ConnectBtn.css'

const PowerBtn = () => {
  return (
    <Box>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32.0001 8C30.5334 8 29.3334 9.2 29.3334 10.6667V32C29.3334 33.4667 30.5334 34.6667 32.0001 34.6667C33.4667 34.6667 34.6667 33.4667 34.6667 32V10.6667C34.6667 9.2 33.4667 8 32.0001 8ZM45.7067 15.6267C45.2162 16.1171 44.9384 16.7809 44.9335 17.4745C44.9285 18.1682 45.1967 18.8359 45.6801 19.3333C48.6934 22.5333 50.5601 26.8 50.6667 31.52C50.9067 41.7333 42.4534 50.5333 32.2401 50.64C29.769 50.6786 27.315 50.2248 25.0212 49.305C22.7273 48.3853 20.6396 47.018 18.8797 45.2829C17.1198 43.5479 15.723 41.4798 14.7708 39.1992C13.8185 36.9187 13.3299 34.4714 13.3334 32C13.3334 27.0933 15.2267 22.64 18.3201 19.3067C19.3067 18.2667 19.3067 16.64 18.2934 15.6267C18.0428 15.3738 17.7438 15.174 17.4142 15.0393C17.0847 14.9046 16.7314 14.8378 16.3754 14.8428C16.0194 14.8477 15.6681 14.9244 15.3424 15.0683C15.0168 15.2122 14.7235 15.4202 14.4801 15.68C10.4782 19.9189 8.17224 25.4797 8.00006 31.3067C7.62673 44.32 18.2134 55.5733 31.2267 55.9733C44.8267 56.4 56.0001 45.4933 56.0001 31.9733C56.0001 25.6533 53.5467 19.9467 49.5467 15.68C48.5334 14.5867 46.7734 14.56 45.7067 15.6267Z" fill="white" />
      </svg>
    </Box>
  )
}

const ConnectBtn = (props) => {

  let btnStyle = {}

  switch (props.statusText) {

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
          }
        }}>
        <PowerBtn />
        <Typography variant='overline'>
          {props.statusText === 'connected' && 'Connected'}
          {props.statusText === 'disconnected' && 'Tap to connect'}
          {props.statusText === 'connecting' && 'connecting...'}
        </Typography>
        <Typography variant='caption' sx={{ color: '#888888' }}>
          180.179.194.63
        </Typography>
      </Stack>
    </>
  )
}



export default ConnectBtn


