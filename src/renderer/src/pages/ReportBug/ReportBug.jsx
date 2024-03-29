import React from 'react'
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader'
import { Box, Button, Chip, Divider, Grid, List, ListItem, ListItemButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Switch from '@mui/material/Switch';
import SettingsItem from '../../components/SettingsItem/SettingsItem';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';


const content = {
  title: 'To help us improve please send diagnostics so we can investigate the issue',
  matter: 'Describe your issue(optional)',
  message: `The easiest and favourite way to use Sentinel VPN is to install the Sentinel app on all of your devices that you'd like to use with a VPN.If you install the Sentinel VPN app on your phone, computer, or other supported device, there is nothing else you need to install to use Sentinel.`,
  button: 'Send'
}
const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};


const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  min-width: 100%;
  max-width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);


const ReportBug = () => {
  return (
    <>
      <Stack direction="column" spacing={2} alignItems={'center'} width={'100%'}>
        <Typography variant={'h6'} sx={{ mt: 1 }} fontWeight={600}>{content.title}</Typography>
        <Stack width={'100%'} sx={{ paddingTop: 6 }} spacing={3}>
          <Typography variant={'caption'} fontWeight={600} >{content.matter}</Typography>
          <Textarea aria-label="minimum height" minRows={3} placeholder="Minimum 3 rows" />
          <Typography variant={'subtitle2'} align='justify' fontWeight={600} sx={{ p: 1 }}>{content.message}</Typography>
        </Stack>
        <Button variant="contained" color="error" size="small" sx={{ px: 9 }}>{content.button}</Button>
      </Stack>
    </>
  )
}

export default ReportBug