import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { Paper, Stack, TextField, Typography } from '@mui/material';
import favIcon from '../../assets/favIcon.svg';
import { GeoItem } from '../GeoItem/GeoItem';


export const GeoItem = (props) => {
  const d = props.data
  return (
    <ListItem key={d.id} sx={{ px: 0 }}>
      <Paper sx={{ width: '100%', p: 2 }}>
        <Stack direction={'row'} justifyContent={'space-between'} width={'100%'}>
          <Stack direction={'column'}>
            <Stack direction={'row'} spacing={2}>
              <img src={`https://flagcdn.com/36x27/${d?.code?.toLowerCase()}.png`} height={'20px'}></img>
              <Typography>
                {d.name}
              </Typography>

            </Stack>

            <Box>
              <Typography display={'inline'} sx={{ paddingRight: 1 }} variant='caption' fontSize={15}>
                Node:
              </Typography>
              <Typography display={'inline'} variant='subtitle2 ' fontSize={15}>
                {d.servers_available}
              </Typography>
            </Box>


          </Stack>
          <Stack alignItems={'center'} justifyContent={'center'} >
            <Stack style={mentIconStyle} alignItems={'center'} justifyContent={'center'} sx={{ backgroundColor: 'gray', borderRadius: '4px' }}>
              <img alt="favicon" src={favIcon} style={{ fill: 'red' }} loading="lazy" width='15px' />
            </Stack>
          </Stack>
        </Stack>
        {/* <Divider /> */}
      </Paper>
    </ListItem>
  )
}
