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
import { SelectionContext } from '../../context/SelectionContext';
import { DeviceTokenContext } from '../../context/DeviceTokenContext';


const GeoSelection = (props) => {

  const [menuClick, setMenuClick] = React.useState(false)
  const { serverList, setServerList } = React.useContext(ServerListContext);
  const { deviceToken, setDeviceToken } = React.useContext(DeviceTokenContext);
  const [loadCityList, setLoadCityList] = React.useState(false)
  const { selectedItems, setSelectedItems } = React.useContext(SelectionContext);

  const mentIconStyle = {
    width: '32px',
    height: '32px'
  }

  React.useEffect(() => {
    if (deviceToken) {
      window.api.getCountries(deviceToken)
        .then((res) => {
          setServerList((d) => {
            return { ...d, countries: res.data }
          })
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }, [deviceToken])


  const DrawerList = (
    <>
      <Stack direction={'column'} spacing={3} sx={{ mx: 4, height: '80vh' }}>
        <Stack direction={'row'} width={'100%'} style={{ justifyContent: 'space-between', alignItems: 'center', padding: '16px 0px' }}>

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
            {loadCityList ? <ArrowBackIcon style={mentIconStyle} /> : <CloseIcon style={mentIconStyle} />}
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

        <Box sx={{ width: '100%' }} role="presentation" >
          <List>
            {
              loadCityList ?

                serverList?.cities[selectedItems?.countryId] ?
                  serverList?.cities[selectedItems?.countryId]?.map((d, i) => {
                    return (
                      <GeoItem key={i} data={{ ...d, code: (serverList?.countries.find(d => d.id == selectedItems?.countryId))?.code }} onClick={() => { }} />

                    )
                  }) :

                  <Typography variant='subtitle2' sx={{ m: 2 }}>
                    Loading cities list ...
                  </Typography>
                :

                serverList?.countries ?

                  serverList?.countries.map((d, i) => {
                    return (
                      <GeoItem key={d?.id} data={d} onClick={(val) => {
                        setLoadCityList(true)
                        setSelectedItems((d) => {
                          return { ...d, countryId: val, cityId: '' }
                        })
                      }} />
                    )
                  }) :

                  <Typography variant='subtitle2' sx={{ m: 2 }}>
                    Loading country list ...
                  </Typography>
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