import React from 'react'
import HomeSettings from '../HomeSettings/HomeSettings'
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader'
import VpnSetting from '../VpnSetting/VpnSetting'

const Settings = (props) => {
  const [settingsPage, setSettingsPage] = React.useState('home')

  return (
    <>
      <SettingsHeader header={settingsPage.toUpperCase()} onClick={() => {
        switch (settingsPage) {

          case 'home':
            // setSettingsPage('home')
            props.onClick()
            break;

          case 'vpnsetting':
            setSettingsPage('home')
            // props.onClick()
            break;

          default:
            setSettingsPage('home')
            props.onClick()
        }
      }} />

      {settingsPage == 'home' && <HomeSettings setSettingsPage={setSettingsPage} />}
      {settingsPage == 'vpnsetting' && <VpnSetting />}

    </>
  )
}

export default Settings