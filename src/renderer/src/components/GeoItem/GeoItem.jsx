import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import favIcon from '../../assets/favIcon.svg';
import ListItemButton from '@mui/material/ListItemButton';
import { FavListContext } from '../../context/FavContext';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import serverIcon from "../../assets/server_icon.svg"


export const GeoItem = (props) => {
  const d = props.data;
  // const { favList, setFavList } = React.useContext(FavListContext);


  // const mentIconStyle = {
  //   width: '28px',
  //   height: '28px'
  // }


  // const FavIcon = () => {

  //   let isFav = false;

  //   if (props.geoType == 'country') {
  //     isFav = favList.countries.includes(d.id);
  //   } else if (props.geoType == 'city') {
  //     isFav = favList?.cities?.[d?.country_id]?.includes(d?.id)
  //   }

  //   return (
  //     <IconButton style={mentIconStyle}
  //       onClick={(e) => {
  //         props.onFavClick();
  //         e.stopPropagation();
  //       }}

  //       sx={{
  //         backgroundColor: isFav ? 'red' : 'gray',
  //         borderRadius: '4px',
  //         '&:hover': {
  //           backgroundColor: isFav ? 'red' : 'gray',
  //         },
  //       }}
  //     // todo prevent hover propogation

  //     >
  //       <img alt="favicon" src={favIcon} loading="lazy" width='14px' />
  //     </IconButton>
  //   )
  // }

  return (
    <ListItem key={d.id} sx={{ p: 0.2 }}>
      <ListItemButton onClick={() => { props.onClick(d.id) }} sx={{ p: 0.7 }}>
        <Stack
          direction={'row'}
          width={'100%'}
          sx={{
            width: '100%',
            p: 2,
            borderRadius: "27px",
            height: "54px",
            backgroundColor: "#262932",
            display: "flex",
            alignItems: "center"
          }}
          justifyContent={"space-between"}
        >

          <Stack direction={'row'}
            sx={{
              alignItems: "center"
            }}>


            <img
              src={props.geoType == "country" ? `https://flagcdn.com/36x27/${d?.code?.toLowerCase()}.png` : serverIcon}
              alt="Country Flag"
              style={{
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                objectFit: 'cover',
              }}
              loading="lazy"
            />


            <Stack direction={'column'} sx={{ mx: 2 }}>

              <Typography fontSize={'16px'} fontWeight={600}>
                {d.name}
              </Typography>


              <Stack direction={"row"}>
                <Typography display={'inline'} sx={{ paddingRight: 1, color: "grey" }} fontSize={'10px'} fontWeight={400}>
                  Node:
                </Typography>
                <Typography display={'inline'} sx={{ color: "grey" }} fontSize={'10px'} fontWeight={400}>
                  {d.servers_available}
                </Typography>
              </Stack>

            </Stack>

          </Stack>

          <Stack alignItems={'center'} justifyContent={'center'} >
            {/* <FavIcon /> */}
            <KeyboardArrowRightIcon />
          </Stack>

        </Stack>
        {/* <Divider /> */}
      </ListItemButton>
    </ListItem >
  )
}
