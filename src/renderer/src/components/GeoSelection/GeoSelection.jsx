import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import favIcon from '../../assets/favIcon.svg';
import BoltIcon from '@mui/icons-material/Bolt';
import { GeoItem } from '../GeoItem/GeoItem';
import { ServerListContext } from '../../context/ServerListContext';


const GeoSelection = (props) => {

  const [menuClick, setMenuClick] = React.useState(false)
  const { serverList, setServerList } = React.useContext(ServerListContext);

  const mentIconStyle = {
    width: '32px',
    height: '32px'
  }


  const DrawerList = (
    <>
      <Stack direction={'column'} spacing={3} sx={{ mx: 4, height: '80vh' }}>
        <Stack direction={'row'} width={'100%'} style={{ justifyContent: 'space-between', alignItems: 'center', padding: '16px 0px' }}>

          <IconButton onClick={() => { setMenuClick(!menuClick) }}>
            {menuClick ? <ArrowBackIcon style={mentIconStyle} /> : <CloseIcon style={mentIconStyle} />}
          </IconButton>

          <IconButton>
            <Box style={mentIconStyle}>
              <img alt="favicon" src={favIcon} style={{ fill: 'red' }} loading="lazy" />
            </Box>
          </IconButton>

        </Stack>

        {/* //todo change the button color */}

        <Button variant='contained' size='large' color='error'>
          <BoltIcon sx={{ color: 'white' }} />
          <Typography sx={{ color: 'white' }}> Quick Connect </Typography>
        </Button>

        <TextField id="outlined-basic" label="Search" variant="outlined" />

        {/* <GeoItem /> */}

        {/*  */}
        {/*  */}

        <Box sx={{ width: '100%' }} role="presentation" onClick={props.onClose}>
          <List>
            {
              serverList?.countries.map((d, i) => {
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
                  </ListItem>)
              })
            }
          </List>
          <Divider />
        </Box>

      </Stack>

    </>
  );
  //
  return (
    <Drawer open={props.open} onClose={props.onClose} anchor='bottom'>
      {DrawerList}
    </Drawer>
  )
}

export default GeoSelection