import React from 'react'
import HomeSettings from '../HomeSettings/HomeSettings'
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader'
import VpnSetting from '../VpnSetting/VpnSetting'
import AppSettings from '../AppSettings/AppSettings'
import SupportPage from '../SupportPage/SupportPage'
import ReportBug from '../ReportBug/ReportBug'
import { Box, Stack, Typography } from '@mui/material'
import { useRecoilValue } from 'recoil'
import { appVersionState } from '../../atoms/app/version'


const Settings = (props) => {
  const [settingsPage, setSettingsPage] = React.useState('Home')
  const appVersion = useRecoilValue(appVersionState);

  return (
    <>
      <SettingsHeader header={settingsPage} onClick={() => {
        switch (settingsPage) {

          case 'Home':
            // setSettingsPage('Home')
            props.onClick() // exits the drawer
            break;

          case 'VPN Setting':
            setSettingsPage('Home')
            break;

          case 'App Setting':
            setSettingsPage('Home')
            break;

          case 'Support':
            setSettingsPage('Home')
            break;

          case 'Report Bug':
            setSettingsPage('Support')
            break;

          case 'Create Ticket':
            setSettingsPage('Support')
            break;

          default:
            setSettingsPage('Home')
            props.onClick()
        }
      }} />

      <Box sx={{
        display: "flex",
        flexDirection: "column",
        // height: "100%"
        flexGrow: 1
      }}>
        {settingsPage == 'Home' && <HomeSettings setSettingsPage={setSettingsPage} />}
        {settingsPage == 'VPN Setting' && <VpnSetting />}
        {settingsPage == 'App Setting' && <AppSettings />}
        {settingsPage == 'Support' && <SupportPage setSettingsPage={setSettingsPage} />}
        {settingsPage == 'Report Bug' && <ReportBug setSettingsPage={setSettingsPage} />}
        {settingsPage == 'Create Ticket' && <ReportBug setSettingsPage={setSettingsPage} />}
      </Box>

      <Stack direction={"row"} sx={{ justifyContent: "center", mb: 1 }}>
        <Typography sx={{ fontWeight: 500 }}>{`Version ${appVersion}`}</Typography>
      </Stack>
    </>
  )
}

export default Settings