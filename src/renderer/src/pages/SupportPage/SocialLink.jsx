import { Box, Button, Chip, Divider, Grid, List, ListItem, ListItemButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import React from 'react'
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import XIcon from '@mui/icons-material/X';
import TelegramIcon from '@mui/icons-material/Telegram';
import GamesIcon from '@mui/icons-material/Games';
import RedditIcon from '@mui/icons-material/Reddit';
import YouTubeIcon from '@mui/icons-material/YouTube';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '70vw',
  transform: 'translate(-50%, -50%)',
  background: "linear-gradient(180deg, #1E1A1B 0%, #171414 100%)",
  boxShadow: 24,
  borderRadius: '5px',
  p: 1,
};

const socalLinks = [
  {
    icon: <XIcon fontSize='14px' />,
    name: 'x / twitter',
    url: 'https://x.com/sentinelvpn'
  },
  {
    icon: <TelegramIcon fontSize='14px' />,
    name: 'telegram',
    url: 'https://t.me/sentinel_co'
  },
  {
    icon: <GamesIcon fontSize='14px' />,
    name: 'discord',
    url: 'https://discord.com/invite/mmAA8qF'
  },
  {
    icon: <RedditIcon fontSize='14px' />,
    name: 'reddit',
    url: 'https://www.reddit.com/r/dVPN/'
  },
  {
    icon: <YouTubeIcon fontSize='14px' />,
    name: 'youtube',
    url: 'https://youtube.com/@sentineldvpn'
  },

]

const SocialItem = (props) => {
  return (
    <ListItem disablePadding>
      <ListItemButton sx={{ p: 1, px: 2, borderRadius: '5px' }}
        onClick={() => window.api.sysOpen(props.url)}
      >
        <ListItemIcon>
          {props.icon}
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{
            fontSize: '14px'
          }}
          primary={props.name} />
      </ListItemButton>
    </ListItem>
  )

}


export default () => {
  return (
    <Box >
      <Box sx={style}>
        <List>
          {socalLinks.map((item, index) => {
            return (
              <SocialItem key={index} icon={item.icon} name={item.name} url={item.url} />
            )
          })}
        </List>
      </Box>
    </Box>
  );
};