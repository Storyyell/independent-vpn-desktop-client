import { refreshServerList } from "../../scripts/utils";

const retryServerNo = 3;

function selectRandomItems(array, count) {
  const randomItems = [];
  const arrayLength = array.length;
  const maxCount = Math.min(count, arrayLength);
  const selectedIndexes = new Set();

  while (randomItems.length < maxCount) {
    const randomIndex = Math.floor(Math.random() * arrayLength);
    if (!selectedIndexes.has(randomIndex)) {
      selectedIndexes.add(randomIndex);
      randomItems.push(array[randomIndex]);
    }
  }

  return randomItems;
}



async function handleVpnConnTrigger(deviceToken, selectedItems, serverList, setVpnStatus, vpnStatusMain, setServerList) {

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
      // console.log(`${selectedItems.countryId}-${selectedItems.cityId}`);

      const slc = await refreshServerList(selectedItems?.countryId, selectedItems?.cityId, setServerList, serverList, deviceToken);
      const slObj = (slc.servers?.[`${selectedItems.countryId}-${selectedItems.cityId}`]);
      const sl = selectRandomItems(slObj.data, retryServerNo);
      console.log(sl);
      if (sl.length > 0) {
        window.api.triggerConnection(sl[0]);
      }

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