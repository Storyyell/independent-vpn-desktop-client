import React from 'react'
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader'
import { Box, Button, Chip, Divider, Grid, List, ListItem, ListItemButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Switch from '@mui/material/Switch';
import SettingsItem from '../../components/SettingsItem/SettingsItem';
import { SysSettingsContext } from '../../context/SysSettingsContext';
import { DnsListContext } from '../../context/DnsListContext';


const VpnSetting = () => {

  const { SysSettings, setSysSettings } = React.useContext(SysSettingsContext);
  const { dnsObj, setDnsObj } = React.useContext(DnsListContext);

  const homeSettingsJson =
    [
      // {
      //   title: 'Auto-connect',
      //   desc: 'Automaically reconnects if you switch networks or restart the app.',
      //   variant: 2,
      //   onClick: () => { props.setSettingsPage('vpnsetting') }
      // },
      {
        title: 'Protocol',
        desc: 'Changes the VPN Protocol',
        variant: 3,
        options: ['V2RAY', 'WIREGUARD'],
        onClick: () => { props.setSettingsPage('appsetting') }

      },

      //todo add this feature after DNS is implemented
      // {
      //   title: 'CleanWeb',
      //   desc: 'Blocks ads, trackers and malware when VPN is restart.',
      //   variant: 2,
      //   onClick: () => { }

      // },
      {
        title: 'VPN Kill Switch',
        desc: 'Disables internet access when VPN connection drops or is turned off.',
        variant: 2,
        checked: SysSettings.killSwitch,
        onChange: (checked) => {
          setSysSettings({ ...SysSettings, killSwitch: checked })
        }
      },

      // {
      //   title: 'Override GPS Location',
      //   desc: 'Match your GPS location to your VPN location.',
      //   variant: 2,
      //   onClick: () => { }

      // },

      {
        title: 'Change DNS',
        desc: 'Change your DNS server to improve privacy',
        variant: 4,
        array: dnsObj.dnsList,
        value: dnsObj.selectedDns,
        label: 'DNS',
        onChange: (e) => {
          setDnsObj((d) => {
            window.api.setDns(parseInt(e.target.value));
            return ({
              ...d,
              selectedDns: e.target.value
            })
          })
        }
      },
      {
        title: 'Tray Icon',
        desc: 'Show App in System Tray when running in background',
        variant: 2,
        checked: SysSettings.trayIcon,
        onChange: (checked) => {
          setSysSettings({ ...SysSettings, trayIcon: checked })
        }
      }
    ]

  return (
    <>
      <Stack spacing={1} width={'100%'}>

        <List sx={{ width: '100%' }}>
          {
            homeSettingsJson.map((item, index) => {
              return (
                <Box key={index} sx={{ paddingBottom: 1 }}>
                  <ListItem disablePadding>
                    <ListItemButton sx={{ p: '3px', borderRadius: 1 }}>
                      <SettingsItem
                        title={item?.title}
                        desc={item?.desc}
                        variant={item?.variant}
                        checked={item?.checked}
                        onChange={item?.onChange}
                        array={item?.array}
                        value={item?.value}
                        label={item?.label}
                        onClick={item?.onClick}
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                </Box>
              )
            })
          }
        </List>

      </Stack>

    </>
  )
}

export default VpnSetting