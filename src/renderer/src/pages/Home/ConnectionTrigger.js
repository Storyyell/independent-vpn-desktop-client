function handleVpnConnTrigger(deviceToken, selectedItems, serverList, setVpnStatus, vpnStatusMain, setServerList) {

  console.log('handleVpnConnTrigger');

  switch (true) {

    case (selectedItems.cityId === null && selectedItems.countryId === null):

      console.log('selectedItems.cityId === null && selectedItems.countryId === null');
      break

    case (selectedItems.cityId === null && selectedItems.countryId !== null):

      console.log('selectedItems.cityId === null && selectedItems.countryId !== null');
      break

    case (selectedItems.cityId !== null && selectedItems.countryId !== null):

      console.log('selectedItems.cityId !== null && selectedItems.countryId !== null');
      break

    default:

      console.log('default');
      break
  }


  // if (vpnStatusMain !== 'connected') {

  //   console.log("vpn connection triggered fron renderer");
  //   let sl = serverList.servers?.[`${selectedItems.countryId}-${selectedItems.cityId}`] || []
  //   if (sl.length > 0) {

  //     const randomIndex = Math.floor(Math.random() * sl.length);
  //     const server = sl[randomIndex]
  //     console.log(server);

  //     let serverParms = {
  //       device_token: deviceToken,
  //       countryCode: selectedItems.countryId,
  //       cityCode: selectedItems.cityId,
  //       serverId: server.id
  //     }

  //     window.api.triggerConnection(serverParms);

  //   } else {
  //     setVpnStatus("fetching server list...")
  //     // Todo handle this case properly
  //     setTimeout(() => { setVpnStatus("VPN disconnected") }, 2000);
  //   }
  // } else {
  //   window.api.triggerDisconnection()
  // }



}

export { handleVpnConnTrigger }