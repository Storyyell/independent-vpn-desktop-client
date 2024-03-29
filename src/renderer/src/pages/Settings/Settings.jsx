import React from 'react'
import HomeSettings from '../HomeSettings/HomeSettings'
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader'
import VpnSetting from '../VpnSetting/VpnSetting'
import AppSettings from '../AppSettings/AppSettings'
import SupportPage from '../SupportPage/SupportPage'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const Settings = (props) => {
  const [settingsPage, setSettingsPage] = React.useState('home')


  return (
    <>
      <SettingsHeader header={capitalizeFirstLetter(settingsPage)} onClick={() => {
        switch (settingsPage) {

          case 'home':
            // setSettingsPage('home')
            props.onClick() // exits the drawer
            break;

          case 'vpn setting':
            setSettingsPage('home')
            break;

          case 'app setting':
            setSettingsPage('home')
            break;

          case 'support':
            setSettingsPage('home')
            break;

          default:
            setSettingsPage('home')
            props.onClick()
        }
      }} />

      {settingsPage == 'home' && <HomeSettings setSettingsPage={setSettingsPage} />}
      {settingsPage == 'vpn setting' && <VpnSetting />}
      {settingsPage == 'app setting' && <AppSettings />}
      {settingsPage == 'support' && <SupportPage />}



    </>
  )
}

export default Settings