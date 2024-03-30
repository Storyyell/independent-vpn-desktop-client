import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import favIcon from '../../assets/favIcon.svg';
import ListItemButton from '@mui/material/ListItemButton';
import { FavListContext } from '../../context/FavContext';


export const GeoItem = (props) => {
  const d = props.data;
  const { favList, setFavList } = React.useContext(FavListContext);


  const mentIconStyle = {
    width: '32px',
    height: '32px'
  }


  const FavIcon = () => {

    let isFav = false;

    if (props.geoType == 'country') {
      isFav = favList.countries.includes(d.id);
    }else if(props.geoType == 'city') {
      isFav = favList?.cities?.[d?.country_id]?.includes(d?.id)
    }

    return (
      <IconButton style={mentIconStyle} alignItems={'center'}
        onClick={(e) => {
          props.onFavClick();
          e.stopPropagation();
        }}

        sx={{
          backgroundColor: isFav ? 'red' : 'gray',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: isFav ? 'red' : 'gray',
          },
        }}
      // todo prevent hover propogation

      >
        <img alt="favicon" src={favIcon} loading="lazy" width='15px' />
      </IconButton>
    )
  }

  return (
    <ListItem key={d.id} sx={{ px: 0 }} >
      <ListItemButton onClick={() => { props.onClick(d.id) }}>
        <Paper sx={{ width: '100%', p: 2 }}>
          <Stack direction={'row'} justifyContent={'space-between'} width={'100%'}>
            <Stack direction={'column'}>
              <Stack direction={'row'} spacing={2}>
                <img src={`https://flagcdn.com/36x27/${d?.code?.toLowerCase()}.png`} height={'20px'} loading='lazy'></img>
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
              <FavIcon />
            </Stack>
          </Stack>
          {/* <Divider /> */}
        </Paper>
      </ListItemButton>
    </ListItem >
  )
}
