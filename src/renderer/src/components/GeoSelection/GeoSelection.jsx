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
import { FavListContext } from '../../context/FavContext';

// todo needs code cleaning here

const GeoSelection = (props) => {

  const [menuClick, setMenuClick] = React.useState(false)
  const { serverList, setServerList } = React.useContext(ServerListContext);
  const { deviceToken, setDeviceToken } = React.useContext(DeviceTokenContext);
  const [loadCityList, setLoadCityList] = React.useState(false)
  const { selectedItems, setSelectedItems } = React.useContext(SelectionContext);
  const { favList, setFavList } = React.useContext(FavListContext);
  const [favIconClick, setFavIconClick] = React.useState(false);
  const [countryListProcessed, setCountryListProcessed] = React.useState(serverList?.countries || []);
  const [cityListProcessed, setCityListProcessed] = React.useState(serverList?.countries || []);
  const [searchField, setSearchField] = React.useState('');


  const mentIconStyle = {
    width: '40px',
    height: '40px',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    borderRadius: '5px',
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

  React.useEffect(() => {
    if (selectedItems?.countryId && deviceToken) {
      window.api.getCities(deviceToken, selectedItems?.countryId)
        .then((res) => {
          setServerList((d) => {
            return {
              ...d, cities: {
                ...d.cities,
                [selectedItems?.countryId]: res.data
              }
            }
          })
        })
        .catch((e) => {
          console.log(e)
        })
    }

  }, [selectedItems?.countryId, deviceToken])

  React.useEffect(() => {

    favIconClick ?
      setCountryListProcessed(serverList?.countries.filter((d) => {
        return favList?.countries?.includes(d?.id)
      }))
      :
      setCountryListProcessed(serverList?.countries)

  }, [serverList?.countries, favIconClick, favList?.countries])

  React.useEffect(() => {

    favIconClick ?
      setCityListProcessed(serverList?.cities?.[selectedItems?.countryId].filter((d) => {
        return favList?.cities?.[selectedItems?.countryId]?.includes(d?.id)
      }))
      :
      setCityListProcessed(serverList?.cities[selectedItems?.countryId])

  }, [serverList?.cities, favIconClick, favList?.cities])

  const handleCityChange = (cityId_) => {
    setSelectedItems((d) => {
      return { ...d, cityId: cityId_ }
    })
    if (deviceToken && selectedItems?.countryId && cityId_) {
      window.api.getServers(deviceToken, selectedItems?.countryId, cityId_)
        .then((res) => {
          setServerList((d) => {
            return {
              ...d, servers: {
                ...d.servers,
                [`${selectedItems?.countryId}-${cityId_}`]: res.data
              }
            }
          })
        })
        .catch((e) => {
          console.log(e)
        })
    }
  };

  React.useEffect(() => {
    if (loadCityList) {
      setCityListProcessed((l) => {
        return (serverList?.cities?.[selectedItems?.countryId]?.filter((d) => { return (d?.name?.toLowerCase()?.includes(searchField.toLowerCase())) }))
      })
    } else {
      setCountryListProcessed(() => {
        return (serverList?.countries?.filter((d) => { return (d?.name?.toLowerCase().includes(searchField.toLowerCase())) }))
      })
    }
  }, [searchField])

  const handleCountryChange = (countryId_) => {
    setLoadCityList(true)
    setSelectedItems((d) => {
      return { ...d, countryId: countryId_, cityId: '' }
    })
  }

  const FavIcon = (props) => {
    return (
      <IconButton onClick={() => {
        props?.setFavIconClick(!props?.favIconClick)
      }} >
        <Box style={{ ...props.mentIconStyle, backgroundColor: props.favIconClick ? 'red' : 'none' }} sx={{ b: 1 }} >
          <img alt="favicon" src={favIcon} loading="lazy" />
        </Box>
      </IconButton>
    )

  }

  const handleResetFav = () => {
    setFavList({ countries: [], cities: {} })
  }


  const DrawerList = (
    <>
      <Stack direction={'column'} spacing={3} sx={{ px: 4, height: '80vh' }}>
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

          {favIconClick && <Typography variant='h6'>Favourites</Typography>}

          <FavIcon favIconClick={favIconClick} setFavIconClick={setFavIconClick} mentIconStyle={mentIconStyle} />

        </Stack>

        {/* //todo change the button color */}

        <Button variant='contained' size='large' color='error'>
          <BoltIcon sx={{ color: 'white' }} />
          <Typography sx={{ color: 'white' }}> Quick Connect </Typography>
        </Button>

        <TextField id="outlined-basic" label={`search ${loadCityList ? 'cities' : 'countries'}`} variant="outlined"
          value={searchField}
          onChange={(e) => {
            setSearchField(e.target.value)
          }} />
        {favIconClick && <Stack style={{ margin: '5px' }} justifyContent={'flex-end'} sx={{ width: '100%' }} flexDirection={'row'}><Button variant='text' color='error' size='small' sx={{ mx: 2 }} onClick={() => { handleResetFav() }}>reset favourities</Button></Stack>}

        <Box sx={{ width: '100%' }} role="presentation" >

          <List >
            {
              loadCityList ?

                serverList?.cities[selectedItems?.countryId] ?
                  cityListProcessed?.map((d, i) => {
                    return (
                      <GeoItem key={i} geoType='city' data={{ ...d, code: (serverList?.countries.find(d => d.id == selectedItems?.countryId))?.code }} onClick={(val) => {
                        handleCityChange(val)
                      }}
                        onFavClick={() => {
                          favList?.cities?.[selectedItems?.countryId]?.includes(d?.id)
                            ?
                            setFavList((c) => {
                              const filteredCities = (c?.cities?.[selectedItems?.countryId]).filter((f) => f !== d.id);
                              if (filteredCities.length === 0) {
                                const newCities = { ...c.cities };
                                delete newCities[selectedItems?.countryId];
                                return { ...c, cities: newCities };
                              } else {
                                return { ...c, cities: { ...c.cities, [selectedItems?.countryId]: filteredCities } };
                              }
                            })
                            :
                            setFavList((c) => {
                              return { ...c, cities: { ...c.cities, [selectedItems?.countryId]: [...(c?.cities?.[selectedItems?.countryId] || []), d?.id] } };
                            })
                        }}
                      />
                    )
                  }) :

                  <Typography variant='subtitle2' sx={{ m: 2 }}>
                    Loading cities list ...
                  </Typography>
                :

                serverList?.countries ?

                  countryListProcessed?.map((d, i) => {
                    return (
                      <GeoItem key={d?.id} data={d} geoType='country' onClick={(val) => {
                        handleCountryChange(val)
                      }}
                        onFavClick={() => {
                          favList?.countries?.includes(d?.id)
                            ?
                            setFavList((c) => {
                              return { ...c, countries: c.countries.filter((f) => f != d?.id) }
                            })
                            :
                            setFavList((c) => {
                              return { ...c, countries: [...c.countries, d?.id] }
                            })
                        }}
                      />
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
    <Drawer
      open={props.open}
      onClose={props.onClose}
      anchor='bottom'
      PaperProps={{
        style: {
          background: 'linear-gradient(180deg, #1E1A1B 0%, #171414 100%)',
        }
      }}
    >
      {DrawerList}
    </Drawer >

  )
}

export default GeoSelection